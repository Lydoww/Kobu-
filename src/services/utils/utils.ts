import { NotFoundError, UnauthorizedError } from '../../errors/AppError';
import prisma from '../../lib/prisma';

export const verifyBoardOwnership = async (boardId: string, userId: string) => {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });
  if (!board) throw new UnauthorizedError('You do not own this board');
  return board;
};

export const verifyColumnOwnership = async (
  columnId: string,
  userId: string
) => {
  console.log('\x1b[36m%s\x1b[0m', `[DEBUG] Vérification ownership:`); // Cyan
  console.log('- User ID:', userId);
  console.log('- Column ID:', columnId);

  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: { select: { userId: true } } },
  });

  console.log('\x1b[33m%s\x1b[0m', '[DEBUG] Colonne trouvée:', column); // Jaune

  if (!column) {
    console.error('\x1b[31m%s\x1b[0m', '[ERROR] Colonne non trouvée'); // Rouge
    throw new NotFoundError('Column not found');
  }

  if (column.board.userId !== userId) {
    console.error('\x1b[31m%s\x1b[0m', '[ERROR] Accès refusé:'); // Rouge
    console.error('- Board owner:', column.board.userId);
    console.error('- Requester:', userId);
    throw new UnauthorizedError('You do not own this column');
  }

  return column;
};

export const verifyTaskOwnership = async (taskId: string, userId: string) => {
  console.log(`[DEBUG] Vérification tâche ${taskId} pour user ${userId}`);

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      column: {
        include: {
          board: {
            select: { userId: true },
          },
        },
      },
    },
  });

  if (!task) {
    console.error('[ERREUR] Tâche non trouvée');
    throw new NotFoundError('Task not found');
  }

  if (task.column.board.userId !== userId) {
    console.error(
      '[ERREUR] Accès refusé :',
      `User ${userId} != propriétaire réel ${task.column.board.userId}`
    );
    throw new UnauthorizedError('You do not own this task');
  }

  return task;
};

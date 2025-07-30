import { NotFoundError } from '../errors/AppError';
import prisma from '../lib/prisma';
import { verifyBoardOwnership, verifyColumnOwnership } from './utils/utils';

export const getColumnsForBoard = async (boardId: string) => {
  return prisma.column.findMany({
    where: { boardId },
    include: {
      tasks: true,
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
};

export const createUserColumn = async (
  boardId: string,
  userId: string,
  title: string,
  order: number
) => {
  await verifyBoardOwnership(boardId, userId);

  return prisma.column.create({
    data: {
      title,
      order,
      boardId,
    },
  });
};

export const getColumnWithTasks = async (columnId: string, userId: string) => {
  const column = await prisma.column.findFirst({
    where: {
      id: columnId,
      board: {
        userId: userId,
      },
    },
    include: {
      tasks: true,
    },
  });
  return column;
};

export const updateOneColumn = async (
  columnId: string,
  userId: string,
  title: string,
  order: number
) => {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { boardId: true },
  });

  if (!column) {
    throw new NotFoundError('Column not found');
  }

  await verifyBoardOwnership(column.boardId, userId);

  return prisma.column.update({
    where: { id: columnId },
    data: { title, order },
  });
};

export const deleteOneColumn = async (columnId: string, userId: string) => {
  const column = await verifyColumnOwnership(columnId, userId);

  await prisma.task.deleteMany({
    where: { columnId },
  });

  return await prisma.column.delete({
    where: { id: columnId },
  });
};

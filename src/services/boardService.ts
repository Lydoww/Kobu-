import { NotFoundError } from '../errors/AppError';
import prisma from '../lib/prisma';
import { BoardWithColumnAndTasks } from '../types/board';
import { Board } from '@prisma/client';

export const getUserBoards = async (
  userId: string
): Promise<BoardWithColumnAndTasks[]> => {
  return prisma.board.findMany({
    where: { userId },
    include: {
      columns: {
        include: {
          tasks: true,
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createUserBoard = async (
  userId: string,
  title: string,
  description: string
): Promise<Board> => {
  return prisma.board.create({
    data: {
      title,
      description,
      userId: userId,
    },
  });
};

export const getBoard = async (
  boardId: string,
  userId: string
): Promise<BoardWithColumnAndTasks> => {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      userId,
    },
    include: {
      columns: {
        include: {
          tasks: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!board) {
    throw new NotFoundError('Board not found');
  }

  return board;
};

export const updateOneBoard = async (
  boardId: string,
  userId: string,
  title: string,
  description: string
): Promise<Board> => {
  const existingBoard = await prisma.board.findFirst({
    where: {
      id: boardId,
      userId,
    },
  });

  if (!existingBoard) {
    throw new NotFoundError('This board does not exist');
  }

  const update = await prisma.board.update({
    where: {
      id: boardId,
    },
    data: {
      title,
      description,
    },
  });
  return update;
};

export const deleteOneBoard = async (
  boardId: string,
  userId: string
): Promise<Board> => {
  const existingBoard = await prisma.board.findFirst({
    where: {
      id: boardId,
      userId,
    },
  });
  if (!existingBoard) {
    throw new NotFoundError('This board does not exist');
  }

  const deleteThisBoard = await prisma.board.delete({
    where: {
      id: boardId,
    },
  });
  return deleteThisBoard;
};

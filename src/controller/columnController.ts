import { NextFunction, Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors/AppError';
import {
  createUserColumn,
  deleteOneColumn,
  getColumnWithTasks,
  getColumnsForBoard,
  updateOneColumn,
} from '../services/columnService';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const getColumnsHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const boardId = req.query.boardId as string;
  if (!boardId) {
    throw new BadRequestError('boardId query parameter is required');
  }

  const board = await prisma.board.findFirst({
    where: { id: boardId, userId: req.user.id },
  });
  if (!board) {
    throw new UnauthorizedError('You do not own this board');
  }

  const columns = await getColumnsForBoard(boardId);
  res.json({ success: true, data: columns });
};

export const createColumn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { title, order, boardId } = req.body;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new BadRequestError('Title cannot be empty');
    }

    if (!trimmedTitle || typeof order !== 'number' || !boardId) {
      throw new BadRequestError('Title, order and boardId are required');
    }

    

    const newColumn = await createUserColumn(
      boardId,
      req.user.id,
      trimmedTitle,
      order
    );
    res.json({ success: true, data: newColumn });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return next(
        new BadRequestError('Column title already exists in this board.')
      );
    }
    next(error);
  }
};

export const getOneColumn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id: columnId } = req.params;
    const column = await getColumnWithTasks(columnId, req.user.id);
    if (!column) {
      throw new UnauthorizedError('You do not have access to this column');
    }
    res.json({ success: true, data: column });
  } catch (error) {
    next(error);
  }
};

export const updateColumn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;
    const { title, order } = req.body;

    const trimmedTitle = title?.trim();
    if (!trimmedTitle || typeof order !== 'number') {
      throw new BadRequestError('Title and order are required');
    }

    const updated = await updateOneColumn(id, req.user.id, trimmedTitle, order);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteColumn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;

    const deleteThisColumn = await deleteOneColumn(id, req.user.id);
    res.json({ success: true, data: deleteThisColumn });
  } catch (error) {
    next(error);
  }
};

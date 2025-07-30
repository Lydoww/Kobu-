import { NextFunction, Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors/AppError';
import {
  createUserBoard,
  deleteOneBoard,
  getBoard,
  getUserBoards,
  updateOneBoard,
} from './../services/boardService';

export const getBoards = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const boards = await getUserBoards(req.user.id);
  res.json({ success: true, data: boards });
};

export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      throw new BadRequestError('Title is required');
    }

    const newBoard = await createUserBoard(req.user.id, title, description);
    res.json({ success: true, data: newBoard });
  } catch (error) {
    next(error);
  }
};

export const getOneBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;
    const oneBoard = await getBoard(id, req.user.id);
    res.json({ success: true, data: oneBoard });
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;
    const { title, description } = req.body;
    const update = await updateOneBoard(id, req.user.id, title, description);
    res.json({ success: true, data: update });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;

    const deleteThisBoard = await deleteOneBoard(id, req.user.id);
    res.json({ success: true, data: deleteThisBoard });
  } catch (error) {
    next(error);
  }
};

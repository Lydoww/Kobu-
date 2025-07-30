import { NextFunction, Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/AppError';
import {
  createUserTask,
  deleteOneTask,
  getTask,
  getTasksForUser,
  updateOneTask,
} from '../services/taskService';
import { Prisma } from '@prisma/client';
import { parseOptionalDate } from '../services/utils/dateUtils';

export const getTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const columnId = req.query.columnId as string;
    if (!columnId) {
      throw new BadRequestError('columnId query parameter is required');
    }

    const tasks = await getTasksForUser(columnId, req.user.id);
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { title, description, dueDate, order, columnId } = req.body;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new BadRequestError('Title cannot be empty');
    }

    if (!trimmedTitle || typeof order !== 'number' || !columnId) {
      throw new BadRequestError('Title, order and columnId are required');
    }

    const parsedDueDate = parseOptionalDate(dueDate);

    const newTask = await createUserTask(
      columnId,
      req.user.id,
      trimmedTitle,
      description,
      parsedDueDate,
      order
    );

    res.json({ success: true, data: newTask });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return next(
        new BadRequestError('Task title already exists in this column')
      );
    }
    next(error);
  }
};

export const getOneTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id: taskId } = req.params;
    const task = await getTask(taskId, req.user.id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;

    const { title, description, order, dueDate } = req.body;
    const trimmedTitle = title?.trim();
    if (!trimmedTitle || typeof order !== 'number') {
      throw new BadRequestError('Title and order are required');
    }

    const parsedDueDate = parseOptionalDate(dueDate);

    const updated = await updateOneTask({
      taskId: id,
      userId: req.user.id,
      title: trimmedTitle,
      description,
      dueDate: parsedDueDate,
      order,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const {  id } = req.params;
    const deleteThisTask = await deleteOneTask(id, req.user.id);
    res.json({ success: true, data: deleteThisTask });
  } catch (error) {
    next(error);
  }
};

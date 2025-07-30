import prisma from '../lib/prisma';
import { verifyColumnOwnership, verifyTaskOwnership } from './utils/utils';

interface UpdateTaskInput {
  taskId: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  order: number;
}

export const getTasksForUser = async (columnId: string, userId: string) => {
  await verifyColumnOwnership(columnId, userId);

  return prisma.task.findMany({
    where: { columnId },
    orderBy: [{ order: 'asc' }],
  });
};

export const createUserTask = async (
  columnId: string,
  userId: string,
  title: string,
  description: string,
  dueDate: Date | undefined,
  order: number
) => {
  await verifyColumnOwnership(columnId, userId);

  return prisma.task.create({
    data: {
      title,
      description,
      dueDate,
      order,
      columnId,
    },
  });
};

export const getTask = async (taskId: string, userId: string) => {
  return await verifyTaskOwnership(taskId, userId);
};

export const updateOneTask = async ({
  taskId,
  userId,
  title,
  description,
  dueDate,
  order,
}: UpdateTaskInput) => {
  await verifyTaskOwnership(taskId, userId);
  return prisma.task.update({
    where: { id: taskId },
    data: { title, description, dueDate, order },
  });
};

export const deleteOneTask = async (taskId: string, userId: string) => {
  await verifyTaskOwnership(taskId, userId);
  return await prisma.task.delete({
    where: { id: taskId },
  });
};

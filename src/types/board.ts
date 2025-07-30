import { Board, Column, Task } from '@prisma/client';

export type TaskType = Task;

export type ColumnWithTasks = Column & {
  tasks: TaskType[];
};

export type BoardWithColumnAndTasks = Board & {
  columns: ColumnWithTasks[];
};

import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  createTask,
  deleteTask,
  getOneTask,
  getTasksHandler,
  updateTask,
} from '../controller/taskController';
import { validateRequest } from '../middleware/Validation/validateInput';
import { taskValidationRules } from '../validators/taskValidation';

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskInput:
 *       type: object
 *       required:
 *         - title
 *         - columnId
 *       properties:
 *         title:
 *           type: string
 *           example: "Implement new feature"
 *         description:
 *           type: string
 *           example: "Add user authentication"
 *         columnId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2023-12-31T23:59:59Z"
 *         order:
 *           type: integer
 *           example: 1
 */

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for a specific column
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: columnId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the column
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Column not found
 */
router.get('/tasks', authMiddleware, getTasksHandler);

/**
 * @swagger
 * /api/task:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/task',
  authMiddleware,
  validateRequest(taskValidationRules),
  createTask
);

/**
 * @swagger
 * /api/task/{id}:
 *   get:
 *     summary: Get a specific task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/task/:id', authMiddleware, getOneTask);

/**
 * @swagger
 * /api/task/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.patch(
  '/task/:id',
  authMiddleware,
  validateRequest(taskValidationRules),
  updateTask
);

/**
 * @swagger
 * /api/task/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/task/:id', authMiddleware, deleteTask);

export default router;

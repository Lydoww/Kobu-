import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  createColumn,
  deleteColumn,
  getColumnsHandler,
  getOneColumn,
  updateColumn,
} from '../controller/columnController';
import { columnValidationRules } from '../validators/columnValidation';
import { validateRequest } from '../middleware/Validation/validateInput';

/**
 * @swagger
 * tags:
 *   name: Columns
 *   description: Column management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ColumnInput:
 *       type: object
 *       required:
 *         - title
 *         - boardId
 *       properties:
 *         title:
 *           type: string
 *           example: "In Progress"
 *         boardId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         order:
 *           type: integer
 *           example: 1
 */

const router = express.Router();

/**
 * @swagger
 * /api/columns:
 *   get:
 *     summary: Get all columns for a specific board
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: boardId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the board
 *     responses:
 *       200:
 *         description: List of columns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Column'
 *       404:
 *         description: Board not found
 */
router.get('/columns', authMiddleware, getColumnsHandler);

/**
 * @swagger
 * /api/column:
 *   post:
 *     summary: Create a new column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ColumnInput'
 *     responses:
 *       201:
 *         description: Column created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Column'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/column',
  authMiddleware,
  validateRequest(columnValidationRules),
  createColumn
);

/**
 * @swagger
 * /api/column/{id}:
 *   get:
 *     summary: Get a specific column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Column ID
 *     responses:
 *       200:
 *         description: Column details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Column'
 *       404:
 *         description: Column not found
 */
router.get('/column/:id', authMiddleware, getOneColumn);

/**
 * @swagger
 * /api/column/{id}:
 *   patch:
 *     summary: Update a column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Column ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ColumnInput'
 *     responses:
 *       200:
 *         description: Updated column
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Column'
 *       404:
 *         description: Column not found
 */
router.patch(
  '/column/:id',
  authMiddleware,
  validateRequest(columnValidationRules),
  updateColumn
);

/**
 * @swagger
 * /api/column/{id}:
 *   delete:
 *     summary: Delete a column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Column ID
 *     responses:
 *       204:
 *         description: Column deleted successfully
 *       404:
 *         description: Column not found
 */
router.delete('/column/:id', authMiddleware, deleteColumn);

export default router;

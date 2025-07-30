import express from 'express';
import {
  createBoard,
  deleteBoard,
  getBoards,
  getOneBoard,
  updateBoard,
} from '../controller/boardController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/Validation/validateInput';
import { boardValidationRules } from '../validators/boardValidation';

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Board management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BoardInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: "Project Roadmap"
 *         description:
 *           type: string
 *           example: "Our product development plan"
 */

const router = express.Router();

/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: Get all boards for current user
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of boards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Board'
 */
router.get('/boards', authMiddleware, getBoards);

/**
 * @swagger
 * /api/board:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardInput'
 *     responses:
 *       201:
 *         description: Board created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/board',
  authMiddleware,
  validateRequest(boardValidationRules),
  createBoard
);

/**
 * @swagger
 * /api/board/{id}:
 *   get:
 *     summary: Get a specific board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Board details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       404:
 *         description: Board not found
 */
router.get('/board/:id', authMiddleware, getOneBoard);

/**
 * @swagger
 * /api/board/{id}:
 *   patch:
 *     summary: Update a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Board ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardInput'
 *     responses:
 *       200:
 *         description: Updated board
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       404:
 *         description: Board not found
 */
router.patch(
  '/board/:id',
  authMiddleware,
  validateRequest(boardValidationRules),
  updateBoard
);

/**
 * @swagger
 * /api/board/{id}:
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Board ID
 *     responses:
 *       204:
 *         description: Board deleted successfully
 *       404:
 *         description: Board not found
 */
router.delete('/board/:id', authMiddleware, deleteBoard);

export default router;

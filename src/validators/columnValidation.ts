import { body } from "express-validator";

export const columnValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be 100 characters max'),

  body('boardId')
    .notEmpty()
    .withMessage('Board ID is required')
    .isUUID()
    .withMessage('Board ID must be a valid UUID'),

  body('order')
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),
];

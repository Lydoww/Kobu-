import { body } from 'express-validator';

export const taskValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be 100 characters max'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be 1000 characters max'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),

  body('order')
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),

  body('columnId')
    .notEmpty()
    .withMessage('Column ID is required')
    .isUUID()
    .withMessage('Column ID must be a valid UUID'),
];

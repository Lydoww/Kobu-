import { BadRequestError } from '../../errors/AppError';

export const parseOptionalDate = (date: unknown): Date | undefined => {
  if (!date) return undefined;

  if (
    typeof date !== 'string' &&
    typeof date !== 'number' &&
    !(date instanceof Date)
  ) {
    throw new BadRequestError('Invalid date input type');
  }

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    throw new BadRequestError('Invalid date format');
  }

  return parsed;
};

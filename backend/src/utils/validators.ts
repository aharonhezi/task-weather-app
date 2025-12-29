import { z } from 'zod';
import { ValidationError } from './errors';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(2, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  password: z.string().min(2, 'Password must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(2, 'Password is required'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  dueDate: z.string().datetime().optional().nullable(),
  tag: z.enum(['Low', 'Medium', 'High', 'Not urgent', 'Urgent']).optional().nullable(),
});

export const updateTaskSchema = taskSchema.partial().extend({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
});

export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      throw new ValidationError('Validation failed', errors);
    }
    throw error;
  }
};


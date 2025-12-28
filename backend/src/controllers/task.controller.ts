import { Request, Response } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from '../services/task.service';
import { validate, taskSchema, updateTaskSchema } from '../utils/validators';
import { AuthRequest } from '../types';

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { search, isCompleted, tag } = req.query;

  const tasks = await getTasks(userId, {
    search: search as string | undefined,
    isCompleted: isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined,
    tag: tag as string | undefined,
  });

  res.json({
    success: true,
    data: tasks,
  });
};

export const getTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const task = await getTaskById(id, userId);

  res.json({
    success: true,
    data: task,
  });
};

export const createNewTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const data = validate(taskSchema, req.body);

  const taskData = {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  };

  const task = await createTask(userId, taskData);

  res.status(201).json({
    success: true,
    data: task,
  });
};

export const updateExistingTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const data = validate(updateTaskSchema, req.body);

  const taskData = {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  };

  const task = await updateTask(id, userId, taskData);

  res.json({
    success: true,
    data: task,
  });
};

export const deleteExistingTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  await deleteTask(id, userId);

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const task = await toggleTaskCompletion(id, userId);

  res.json({
    success: true,
    data: task,
  });
};

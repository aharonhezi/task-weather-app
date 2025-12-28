import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  getAllTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  toggleTask,
} from '../controllers/task.controller';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getAllTasks));
router.get('/:id', asyncHandler(getTask));
router.post('/', asyncHandler(createNewTask));
router.put('/:id', asyncHandler(updateExistingTask));
router.delete('/:id', asyncHandler(deleteExistingTask));
router.patch('/:id/toggle', asyncHandler(toggleTask));

export default router;

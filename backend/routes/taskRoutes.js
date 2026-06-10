import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.route('/').post(createTask).get(getAllTasks);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;

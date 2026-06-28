import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  createTaskValidation,
  updateTaskValidation,
  idParamValidation,
} from '../validators/taskValidator.js';

const router = express.Router();

router.use(verifyToken);

router.route('/')
  .post(createTaskValidation, createTask)
  .get(getAllTasks);

router.route('/:id')
  .get(idParamValidation, getTaskById)
  .put(idParamValidation, updateTaskValidation, updateTask)
  .delete(idParamValidation, deleteTask);

export default router;

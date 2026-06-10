import express from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', verifyToken, getMe);
router.get('/users', verifyToken, isAdmin, getAllUsers);

export default router;

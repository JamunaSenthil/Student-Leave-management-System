import { Router } from 'express';
import {
  registerStudent,
  registerHOD,
  registerWarden,
  loginStudent,
  loginHOD,
  loginWarden,
  getMe,
  logout,
} from '../controllers/authController.ts';
import { verifyAuth } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/student/register', registerStudent);
router.post('/hod/register', registerHOD);
router.post('/warden/register', registerWarden);
router.post('/student/login', loginStudent);
router.post('/hod/login', loginHOD);
router.post('/warden/login', loginWarden);
router.post('/logout', logout);
router.get('/me', verifyAuth, getMe);

export default router;

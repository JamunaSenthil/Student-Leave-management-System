import { Router } from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
} from '../controllers/studentController.ts';
import { verifyAuth, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(verifyAuth, requireRole(['student']));

router.get('/profile', getStudentProfile);
router.patch('/profile', updateStudentProfile);
router.get('/dashboard', getStudentDashboard);

export default router;

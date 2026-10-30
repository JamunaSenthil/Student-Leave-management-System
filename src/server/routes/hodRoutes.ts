import { Router } from 'express';
import {
  getHODDashboard,
  getDepartmentStudents,
  getDepartmentLeaves,
  getHODLeaveById,
  decideLeaveHOD,
} from '../controllers/hodController.ts';
import { verifyAuth, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(verifyAuth, requireRole(['hod']));

router.get('/dashboard', getHODDashboard);
router.get('/students', getDepartmentStudents);
router.get('/leaves', getDepartmentLeaves);
router.get('/leaves/:id', getHODLeaveById);
router.patch('/leaves/:id/decision', decideLeaveHOD);

export default router;

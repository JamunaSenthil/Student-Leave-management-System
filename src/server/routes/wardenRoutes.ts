import { Router } from 'express';
import {
  getWardenDashboard,
  getHostelStudents,
  getHostelLeaves,
  getWardenLeaveById,
  decideLeaveWarden,
} from '../controllers/wardenController.ts';
import { verifyAuth, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(verifyAuth, requireRole(['warden']));

router.get('/dashboard', getWardenDashboard);
router.get('/students', getHostelStudents);
router.get('/leaves', getHostelLeaves);
router.get('/leaves/:id', getWardenLeaveById);
router.patch('/leaves/:id/decision', decideLeaveWarden);

export default router;

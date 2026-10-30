import { Router } from 'express';
import {
  applyLeave,
  getMyLeaves,
  getLeaveById,
  trackLeave,
} from '../controllers/leaveController.ts';
import { verifyAuth, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(verifyAuth);

router.post('/', requireRole(['student']), applyLeave);
router.get('/my-leaves', requireRole(['student']), getMyLeaves);
router.get('/:id', getLeaveById);
router.get('/:id/track', trackLeave);

export default router;

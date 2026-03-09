import { Router } from 'express';
import { requireAdmin, requireStaff } from '../middleware/auth.middleware';
import * as adminCtrl from '../controllers/admin.controller';

const router = Router();

// Staff management (Admin only)
router.get('/staff', requireAdmin, adminCtrl.getStaff);
router.post('/staff', requireAdmin, adminCtrl.createStaff);
router.put('/staff/:id', requireAdmin, adminCtrl.updateStaff);

// App config (Admin only)
router.get('/config', requireAdmin, adminCtrl.getAppConfig);
router.put('/config', requireAdmin, adminCtrl.updateAppConfig);

// Stats & Export (Staff)
router.get('/stats', requireStaff, adminCtrl.getStats);
router.get('/export', requireStaff, adminCtrl.exportReports);

export default router;

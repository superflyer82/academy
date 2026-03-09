import { Router } from 'express';
import { uploadPhotos } from '../middleware/upload.middleware';
import { requireStaff, optionalAuth, requireAuth } from '../middleware/auth.middleware';
import * as reportCtrl from '../controllers/report.controller';

const router = Router();

// Public routes
router.get('/', reportCtrl.getPublicReports);
router.get('/nearby', reportCtrl.getNearbyReports);
router.post('/', optionalAuth, (req, res, next) => {
  uploadPhotos(req, res, (err) => {
    if (err) { next(err); return; }
    next();
  });
}, reportCtrl.createReport);
router.get('/track/:publicToken', reportCtrl.trackReport);
router.get('/:id', reportCtrl.getReportById);

// Citizen routes
router.get('/citizen/my', requireAuth, reportCtrl.getCitizenReports);

// Staff routes
router.get('/dashboard/list', requireStaff, reportCtrl.getDashboardReports);
router.get('/dashboard/:id', requireStaff, reportCtrl.getDashboardReportById);
router.patch('/dashboard/:id/status', requireStaff, reportCtrl.updateStatus);
router.patch('/dashboard/:id/assign', requireStaff, reportCtrl.assignReport);
router.post('/dashboard/:id/comments', requireStaff, reportCtrl.addComment);
router.patch('/dashboard/bulk', requireStaff, reportCtrl.bulkUpdate);

export default router;

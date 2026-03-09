import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.middleware';
import * as categoryCtrl from '../controllers/category.controller';

const router = Router();

router.get('/', categoryCtrl.getActiveCategories);
router.get('/all', requireAdmin, categoryCtrl.getAllCategories);
router.post('/', requireAdmin, categoryCtrl.createCategory);
router.put('/:id', requireAdmin, categoryCtrl.updateCategory);
router.delete('/:id', requireAdmin, categoryCtrl.deleteCategory);

export default router;

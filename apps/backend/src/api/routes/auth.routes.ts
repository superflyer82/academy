import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';

const router = Router();

router.post('/login', authCtrl.citizenLogin);
router.post('/register', authCtrl.citizenRegister);
router.post('/logout', authCtrl.logout);
router.post('/staff/login', authCtrl.staffLogin);

export default router;

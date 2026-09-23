import  express  from 'express';
import { deductUserCredits, login, logOut, updateUserPlan } from '../controllers/auth.controller.js';

const router=express.Router()

router.post('/login',login)
router.get('/logout',logOut)
router.patch('/update-user-plan',updateUserPlan)
router.patch('/deduct-user-credits',deductUserCredits)

export default router
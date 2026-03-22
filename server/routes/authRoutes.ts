import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Correct way: pass the function reference, don't call it like authController.signup()
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

export default router;

import express from 'express';
import { getProgress, updateProgress, getAllProgress } from '../controllers/progressController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllProgress);
router.get('/:bookId', getProgress);
router.post('/:bookId', updateProgress);

export default router;

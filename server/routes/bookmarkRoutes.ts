import express from 'express';
import { getBookmarksByBook, addBookmark, deleteBookmark, getAllBookmarks } from '../controllers/bookmarkController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllBookmarks);
router.get('/:bookId', getBookmarksByBook);
router.post('/', addBookmark);
router.delete('/:id', deleteBookmark);

export default router;

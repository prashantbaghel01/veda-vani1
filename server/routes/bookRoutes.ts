import express from 'express';
import {
  getAllBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = express.Router();

// Search route must come before :id route to avoid conflict
router.get('/search', searchBooks);

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;

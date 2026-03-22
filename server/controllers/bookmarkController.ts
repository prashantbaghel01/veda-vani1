import { Request, Response } from 'express';
import Bookmark from '../models/Bookmark.js';

export const getBookmarksByBook = async (req: any, res: Response) => {
  try {
    const { bookId } = req.params;
    const bookmarks = await Bookmark.find({
      user: req.user._id,
      book: bookId
    }).sort({ page: 1 });

    res.status(200).json({
      status: 'success',
      data: bookmarks
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addBookmark = async (req: any, res: Response) => {
  try {
    const { bookId, page, content } = req.body;

    const bookmark = await Bookmark.findOneAndUpdate(
      { user: req.user._id, book: bookId, page },
      { content },
      { upsert: true, new: true }
    );

    res.status(201).json({
      status: 'success',
      data: bookmark
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBookmark = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await Bookmark.findOneAndDelete({ _id: id, user: req.user._id });

    res.status(200).json({
      status: 'success',
      message: 'Bookmark deleted'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookmarks = async (req: any, res: Response) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('book', 'title author cover')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      status: 'success',
      data: bookmarks
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

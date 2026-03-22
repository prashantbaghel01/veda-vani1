import { Request, Response } from 'express';
import ReadingProgress from '../models/ReadingProgress.js';

export const getProgress = async (req: any, res: Response) => {
  try {
    const { bookId } = req.params;
    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      book: bookId
    });

    res.status(200).json({
      status: 'success',
      data: progress || { page: 0 }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgress = async (req: any, res: Response) => {
  try {
    const { bookId } = req.params;
    const { page } = req.body;

    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, book: bookId },
      { page, lastRead: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      status: 'success',
      data: progress
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProgress = async (req: any, res: Response) => {
  try {
    const progress = await ReadingProgress.find({ user: req.user._id })
      .populate('book', 'title author cover');

    res.status(200).json({
      status: 'success',
      data: progress
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

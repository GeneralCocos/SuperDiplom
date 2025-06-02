import { Request, Response } from 'express';
import Achievement, { IAchievement } from '../models/Achievement';

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await Achievement.find({ userId: req.user._id });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

export const unlockAchievement = async (req: Request, res: Response) => {
  try {
    const { achievementId } = req.params;
    const achievement = await Achievement.findOneAndUpdate(
      { _id: achievementId, userId: req.user._id },
      { unlockedAt: new Date() },
      { new: true }
    );

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error unlocking achievement' });
  }
};

export const createAchievement = async (req: Request, res: Response) => {
  try {
    const { title, description, icon } = req.body;
    const achievement = new Achievement({
      title,
      description,
      icon,
      userId: req.user._id
    });

    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating achievement' });
  }
}; 
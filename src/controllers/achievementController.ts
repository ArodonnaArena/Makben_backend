import { Response } from 'express';
import Achievement from '../models/Achievement';
import { AuthRequest } from '../middleware/auth';
import { deleteFile } from '../middleware/upload';

// Get all achievements (public)
export const getAllAchievements = async (req: AuthRequest, res: Response) => {
  try {
    const { category, featured } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    const achievements = await Achievement.find(filter).sort({ date: -1 });
    res.json({ achievements });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single achievement (public)
export const getAchievement = async (req: AuthRequest, res: Response) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json({ achievement });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create achievement (admin only)
export const createAchievement = async (req: AuthRequest, res: Response) => {
  try {
    const achievementData = req.body;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.achievement && files.achievement[0]) {
        achievementData.imageUrl = `/uploads/achievements/${files.achievement[0].filename}`;
      }
      
      if (files.document && files.document[0]) {
        achievementData.documentUrl = `/uploads/documents/${files.document[0].filename}`;
      }
    }

    const achievement = new Achievement(achievementData);
    await achievement.save();

    res.status(201).json({
      message: 'Achievement created successfully',
      achievement,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update achievement (admin only)
export const updateAchievement = async (req: AuthRequest, res: Response) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const updateData = req.body;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.achievement && files.achievement[0]) {
        if (achievement.imageUrl) {
          deleteFile(`./uploads${achievement.imageUrl.replace('/uploads', '')}`);
        }
        updateData.imageUrl = `/uploads/achievements/${files.achievement[0].filename}`;
      }
      
      if (files.document && files.document[0]) {
        if (achievement.documentUrl) {
          deleteFile(`./uploads${achievement.documentUrl.replace('/uploads', '')}`);
        }
        updateData.documentUrl = `/uploads/documents/${files.document[0].filename}`;
      }
    }

    Object.assign(achievement, updateData);
    await achievement.save();

    res.json({
      message: 'Achievement updated successfully',
      achievement,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete achievement (admin only)
export const deleteAchievement = async (req: AuthRequest, res: Response) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    if (achievement.imageUrl) {
      deleteFile(`./uploads${achievement.imageUrl.replace('/uploads', '')}`);
    }
    if (achievement.documentUrl) {
      deleteFile(`./uploads${achievement.documentUrl.replace('/uploads', '')}`);
    }

    await Achievement.findByIdAndDelete(req.params.id);

    res.json({ message: 'Achievement deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

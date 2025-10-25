import { Response } from 'express';
import Experience from '../models/Experience';
import { AuthRequest } from '../middleware/auth';
import { deleteFile } from '../middleware/upload';

// Get all experiences (public)
export const getAllExperiences = async (req: AuthRequest, res: Response) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json({ experiences });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single experience (public)
export const getExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json({ experience });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create experience (admin only)
export const createExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experienceData = req.body;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.companyLogo && files.companyLogo[0]) {
        experienceData.companyLogo = `/uploads/logos/${files.companyLogo[0].filename}`;
      }
    }

    const experience = new Experience(experienceData);
    await experience.save();

    res.status(201).json({
      message: 'Experience created successfully',
      experience,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update experience (admin only)
export const updateExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const updateData = req.body;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.companyLogo && files.companyLogo[0]) {
        if (experience.companyLogo) {
          deleteFile(`./uploads${experience.companyLogo.replace('/uploads', '')}`);
        }
        updateData.companyLogo = `/uploads/logos/${files.companyLogo[0].filename}`;
      }
    }

    Object.assign(experience, updateData);
    await experience.save();

    res.json({
      message: 'Experience updated successfully',
      experience,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete experience (admin only)
export const deleteExperience = async (req: AuthRequest, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    if (experience.companyLogo) {
      deleteFile(`./uploads${experience.companyLogo.replace('/uploads', '')}`);
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.json({ message: 'Experience deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

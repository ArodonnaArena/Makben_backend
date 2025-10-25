import { Response } from 'express';
import Profile from '../models/Profile';
import { AuthRequest } from '../middleware/auth';
import { deleteFile } from '../middleware/upload';

// Get profile (public)
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // Get the first (and should be only) profile
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ profile });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update profile (admin only)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profileData = req.body;

    // Handle uploaded files
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.profileImage && files.profileImage[0]) {
        profileData.profileImage = `/uploads/profiles/${files.profileImage[0].filename}`;
      }
      
      if (files.resume && files.resume[0]) {
        profileData.resumeUrl = `/uploads/documents/${files.resume[0].filename}`;
      }
    }

    // Find existing profile
    let profile = await Profile.findOne();

    if (profile) {
      // Delete old files if new ones are uploaded
      if (profileData.profileImage && profile.profileImage) {
        deleteFile(`./uploads${profile.profileImage.replace('/uploads', '')}`);
      }
      if (profileData.resumeUrl && profile.resumeUrl) {
        deleteFile(`./uploads${profile.resumeUrl.replace('/uploads', '')}`);
      }

      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile(profileData);
      await profile.save();
    }

    res.json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

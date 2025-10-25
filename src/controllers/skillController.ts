import { Response } from 'express';
import Skill from '../models/Skill';
import { AuthRequest } from '../middleware/auth';

// Get all skills (public)
export const getAllSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category) filter.category = category;

    const skills = await Skill.find(filter).sort({ proficiency: -1 });
    res.json({ skills });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single skill (public)
export const getSkill = async (req: AuthRequest, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ skill });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create skill (admin only)
export const createSkill = async (req: AuthRequest, res: Response) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();

    res.status(201).json({
      message: 'Skill created successfully',
      skill,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update skill (admin only)
export const updateSkill = async (req: AuthRequest, res: Response) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({
      message: 'Skill updated successfully',
      skill,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete skill (admin only)
export const deleteSkill = async (req: AuthRequest, res: Response) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk create skills (admin only)
export const bulkCreateSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const createdSkills = await Skill.insertMany(skills);

    res.status(201).json({
      message: `${createdSkills.length} skills created successfully`,
      skills: createdSkills,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

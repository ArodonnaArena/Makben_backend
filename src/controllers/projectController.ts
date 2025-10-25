import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';
import { deleteFile } from '../middleware/upload';

// Get all projects (public)
export const getAllProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { category, status, featured } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single project (public)
export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create project (admin only)
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectData = req.body;

    // Handle uploaded images
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.imageUrl && files.imageUrl[0]) {
        projectData.imageUrl = `/uploads/projects/${files.imageUrl[0].filename}`;
      }
      if (files.images) {
        projectData.images = files.images.map(
          (file) => `/uploads/projects/${file.filename}`
        );
      }
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update project (admin only)
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = req.body;

    // Handle uploaded images
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.imageUrl && files.imageUrl[0]) {
        // Delete old image
        if (project.imageUrl) {
          deleteFile(`./uploads${project.imageUrl.replace('/uploads', '')}`);
        }
        updateData.imageUrl = `/uploads/projects/${files.imageUrl[0].filename}`;
      }
      
      if (files.images) {
        // Delete old images
        if (project.images && project.images.length > 0) {
          project.images.forEach((img) => {
            deleteFile(`./uploads${img.replace('/uploads', '')}`);
          });
        }
        updateData.images = files.images.map(
          (file) => `/uploads/projects/${file.filename}`
        );
      }
    }

    Object.assign(project, updateData);
    await project.save();

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete project (admin only)
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated files
    if (project.imageUrl) {
      deleteFile(`./uploads${project.imageUrl.replace('/uploads', '')}`);
    }
    if (project.images && project.images.length > 0) {
      project.images.forEach((img) => {
        deleteFile(`./uploads${img.replace('/uploads', '')}`);
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

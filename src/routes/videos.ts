import express, { Request, Response } from 'express';
import Video from '../models/Video';
import { authenticateToken as auth } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/videos';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.includes('video');
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

// Configure multer for thumbnail uploads
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/thumbnails';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumb-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const thumbnailUpload = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails!'));
    }
  }
});

// Upload video file
router.post('/upload-video', auth, videoUpload.single('video'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }
    
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    res.json({ videoUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload thumbnail image
router.post('/upload-thumbnail', auth, thumbnailUpload.single('thumbnail'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No thumbnail file uploaded' });
    }
    
    const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    res.json({ thumbnailUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all videos with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, featured, tags } = req.query;
    
    const filter: any = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (tags && typeof tags === 'string') {
      filter.tags = { $in: tags.split(',') };
    }
    
    const videos = await Video.find(filter)
      .sort({ featured: -1, publishedDate: -1 })
      .lean();
    
    res.json(videos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single video by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new video
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update video
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(video);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete video
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Delete video file if not external
    if (!video.isExternal && video.videoUrl) {
      const videoPath = path.join(__dirname, '../../', video.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    // Delete thumbnail file
    if (video.thumbnailUrl) {
      const thumbnailPath = path.join(__dirname, '../../', video.thumbnailUrl);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    await video.deleteOne();
    res.json({ message: 'Video deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

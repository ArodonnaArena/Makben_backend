import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'others';
    
    if (file.fieldname === 'profileImage') {
      folder = 'profiles';
    } else if (file.fieldname === 'projectImage' || file.fieldname === 'images') {
      folder = 'projects';
    } else if (file.fieldname === 'resume' || file.fieldname === 'document') {
      folder = 'documents';
    } else if (file.fieldname === 'companyLogo') {
      folder = 'logos';
    } else if (file.fieldname === 'achievement') {
      folder = 'achievements';
    }
    
    const folderPath = path.join(uploadsDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  
  if (file.fieldname === 'resume' || file.fieldname === 'document') {
    const isValidDoc = allowedDocTypes.test(ext) && 
                       (mimetype === 'application/pdf' || 
                        mimetype === 'application/msword' || 
                        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    if (isValidDoc) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  } else {
    const isValidImage = allowedImageTypes.test(ext) && mimetype.startsWith('image/');
    
    if (isValidImage) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// Export helper function to delete files
export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

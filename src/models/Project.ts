import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  shortDescription: {
    type: String,
    required: true
  },
  technologies: [String],
  imageUrl: String,
  images: [String], // Multiple images
  projectUrl: String,
  githubUrl: String,
  category: {
    type: String,
    enum: ['electrical', 'software', 'infrastructure', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  startDate: Date,
  endDate: Date,
  client: String,
  role: String,
  challenges: [String],
  outcomes: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
ProjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Project', ProjectSchema);

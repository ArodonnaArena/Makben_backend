import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ['award', 'certification', 'publication', 'recognition', 'milestone', 'other'],
    default: 'other',
  },
  issuer: String,
  imageUrl: String,
  documentUrl: String, // For certificates/documents
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AchievementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Achievement', AchievementSchema);

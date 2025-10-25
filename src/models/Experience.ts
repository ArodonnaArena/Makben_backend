import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  location: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  responsibilities: [String],
  achievements: [String],
  technologies: [String],
  companyLogo: String,
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

ExperienceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Experience', ExperienceSchema);

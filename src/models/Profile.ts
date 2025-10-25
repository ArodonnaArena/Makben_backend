import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: String,
  bio: {
    type: String,
    required: true,
  },
  tagline: String,
  profileImage: String,
  resumeUrl: String,
  email: {
    type: String,
    required: true,
  },
  phone: String,
  birthday: Date,
  interests: [String],
  location: {
    city: String,
    state: String,
    country: String,
  },
  social: {
    linkedin: String,
    github: String,
    twitter: String,
    facebook: String,
    instagram: String,
    website: String,
  },
  stats: {
    yearsOfExperience: Number,
    projectsCompleted: Number,
    certificationsEarned: Number,
    clientsSatisfied: Number,
  },
  skills: {
    technical: [String],
    soft: [String],
  },
  languages: [{
    name: String,
    proficiency: String, // Native, Fluent, Intermediate, Basic
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
  }],
  availability: {
    type: String,
    enum: ['available', 'unavailable', 'open-to-opportunities'],
    default: 'open-to-opportunities',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Only allow one profile document
ProfileSchema.index({ _id: 1 }, { unique: true });

export default mongoose.model('Profile', ProfileSchema);

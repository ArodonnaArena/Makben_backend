import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: 'Project Demo' | 'Tutorial' | 'Presentation' | 'Interview' | 'Event' | 'Other';
  duration?: string;
  tags: string[];
  featured: boolean;
  views: number;
  publishedDate: Date;
  externalUrl?: string;
  isExternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  category: {
    type: String,
    enum: ['Project Demo', 'Tutorial', 'Presentation', 'Interview', 'Event', 'Other'],
    default: 'Other'
  },
  duration: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  externalUrl: {
    type: String
  },
  isExternal: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
videoSchema.index({ category: 1, featured: -1, publishedDate: -1 });
videoSchema.index({ tags: 1 });

export default mongoose.model<IVideo>('Video', videoSchema);

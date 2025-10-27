import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile';

dotenv.config();

const viewProfile = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const profile = await Profile.findOne();
    
    if (profile) {
      console.log('📋 Current Profile Structure:');
      console.log(JSON.stringify(profile, null, 2));
    } else {
      console.log('❌ No profile found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit();
  }
};

viewProfile();

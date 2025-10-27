import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find and update admin user
    const admin = await User.findOne({ email: 'admin@makben.com' });
    
    if (admin) {
      const newPassword = 'Admin@123';
      // Don't hash manually - the pre-save hook will do it
      admin.password = newPassword;
      await admin.save();
      console.log('✅ Admin password reset successfully!');
      console.log('\n📝 Admin Login Credentials:');
      console.log('Email: admin@makben.com');
      console.log('Password: Admin@123');
    } else {
      console.log('❌ Admin user not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit();
  }
};

resetAdmin();

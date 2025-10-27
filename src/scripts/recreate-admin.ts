import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const recreateAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin user
    const deleted = await User.deleteOne({ email: 'admin@makben.com' });
    console.log(`🗑️  Deleted ${deleted.deletedCount} user(s)`);

    // Create new admin user (password will be hashed by pre-save hook)
    const newAdmin = new User({
      email: 'admin@makben.com',
      password: 'Admin@123',
      name: 'Makanjuola Ebenezer',
      role: 'admin'
    });

    await newAdmin.save();
    console.log('✅ New admin user created!');
    console.log('\n📝 Admin Login Credentials:');
    console.log('Email: admin@makben.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit();
  }
};

recreateAdmin();

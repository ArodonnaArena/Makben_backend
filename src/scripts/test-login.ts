import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const testLogin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@makben.com';
    const password = 'Admin@123';

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Test password
    const isMatch = await user.comparePassword(password);
    console.log('\n🔐 Password match:', isMatch);

    if (isMatch) {
      console.log('✅ Login would succeed!');
    } else {
      console.log('❌ Login would fail - password does not match');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit();
  }
};

testLogin();

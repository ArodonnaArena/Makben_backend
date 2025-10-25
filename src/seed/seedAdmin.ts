import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@makben.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists.');
      console.log('📧 Email: admin@makben.com');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@makben.com',
      password: 'Admin@123',  // Change this after first login!
      name: 'Admin User',
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Email: admin@makben.com');
    console.log('   Password: Admin@123');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

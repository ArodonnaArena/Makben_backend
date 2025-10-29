import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const DEFAULT_EMAIL = 'superadmin@makben.com';
const DEFAULT_PASSWORD = 'SuperAdmin@123';
const DEFAULT_NAME = 'Ultimate Admin';

async function seedSuperAdmin() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');

  try {
    // If a superadmin already exists, exit
    const existingSuper = await User.findOne({ role: 'superadmin' });
    if (existingSuper) {
      console.log(`ℹ️ Superadmin already exists: ${existingSuper.email}`);
      return;
    }

    // Prefer to promote existing admin@makben.com if present
    const defaultAdmin = await User.findOne({ email: 'admin@makben.com' });
    if (defaultAdmin) {
      defaultAdmin.role = 'superadmin' as any;
      await defaultAdmin.save();
      console.log(`✅ Promoted existing admin to superadmin: ${defaultAdmin.email}`);
      return;
    }

    // Otherwise create a brand new superadmin (change these creds immediately after)
    const email = process.env.SUPERADMIN_EMAIL || DEFAULT_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD || DEFAULT_PASSWORD;
    const name = process.env.SUPERADMIN_NAME || DEFAULT_NAME;

    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      existingByEmail.role = 'superadmin' as any;
      // Optionally reset password if env provided
      if (process.env.SUPERADMIN_PASSWORD) {
        existingByEmail.password = password;
      }
      await existingByEmail.save();
      console.log(`✅ Elevated existing user to superadmin: ${email}`);
      return;
    }

    const superadmin = new User({ email, password, name, role: 'superadmin' });
    await superadmin.save();
    console.log('✅ Superadmin user created');
    console.log(`   Email: ${email}`);
    console.log('   Password: (hidden)');
  } catch (err) {
    console.error('❌ Error seeding superadmin:', err);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedSuperAdmin();

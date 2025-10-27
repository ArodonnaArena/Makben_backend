import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile';
import Project from '../models/Project';
import Skill from '../models/Skill';
import Experience from '../models/Experience';
import Achievement from '../models/Achievement';
import Service from '../models/Service';
import User from '../models/User';

dotenv.config();

const checkDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    console.log(`📍 Database: ${mongoUri}\n`);

    const collections = [
      { name: 'Users', model: User },
      { name: 'Profiles', model: Profile },
      { name: 'Projects', model: Project },
      { name: 'Skills', model: Skill },
      { name: 'Experiences', model: Experience },
      { name: 'Achievements', model: Achievement },
      { name: 'Services', model: Service }
    ];

    for (const collection of collections) {
      const count = await collection.model.countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit();
  }
};

checkDatabase();

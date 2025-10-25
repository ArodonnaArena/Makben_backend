import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile';

dotenv.config();

const seedProfile = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if profile already exists
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      console.log('⚠️  Profile already exists. Skipping seed.');
      await mongoose.connection.close();
      return;
    }

    // Create initial profile
    const profile = new Profile({
      firstName: 'Your',
      lastName: 'Name',
      title: 'Full Stack Developer',
      company: 'Your Company',
      bio: 'Passionate developer with expertise in building modern web applications.',
      tagline: 'Building digital solutions',
      email: 'your.email@example.com',
      phone: '+234 XXX XXX XXXX',
      location: {
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
      },
      social: {
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourprofile',
        twitter: 'https://twitter.com/yourprofile',
      },
      stats: {
        yearsOfExperience: 5,
        projectsCompleted: 50,
        certificationsEarned: 10,
        clientsSatisfied: 30,
      },
      skills: {
        technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB'],
        soft: ['Communication', 'Problem Solving', 'Team Collaboration'],
      },
      languages: [
        { name: 'English', proficiency: 'Native' },
        { name: 'French', proficiency: 'Intermediate' },
      ],
      availability: 'open-to-opportunities',
    });

    await profile.save();
    console.log('✅ Profile seeded successfully!');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding profile:', error);
    process.exit(1);
  }
};

seedProfile();

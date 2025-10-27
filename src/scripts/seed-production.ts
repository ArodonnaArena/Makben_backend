import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile';
import Skill from '../models/Skill';
import Project from '../models/Project';
import Experience from '../models/Experience';
import Achievement from '../models/Achievement';
import Service from '../models/Service';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedProduction = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/makben-portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // 1. Create Admin User
    const existingAdmin = await User.findOne({ email: 'admin@makben.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        email: 'admin@makben.com',
        password: hashedPassword,
        name: 'Makanjuola Ebenezer',
        role: 'admin'
      });
      console.log('✅ Admin user created (email: admin@makben.com, password: Admin@123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // 2. Create Profile
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create({
        firstName: 'Makanjuola',
        lastName: 'Ebenezer',
        title: 'Electrical Engineer',
        company: 'Nigerian Airspace Management Agency (NAMA)',
        bio: 'Passionate electrical engineer specializing in power systems, renewable energy, and aviation electrical infrastructure. Dedicated to innovative solutions in electrical engineering.',
        tagline: 'Innovating Electrical Solutions for a Sustainable Future',
        profileImage: 'https://via.placeholder.com/300',
        email: 'cosmicrocketadventure@gmail.com',
        phone: '+234-XXX-XXX-XXXX',
        birthday: new Date('1995-01-01'),
        interests: ['Power Systems', 'Renewable Energy', 'Aviation Technology', 'IoT'],
        location: {
          city: 'Lagos',
          state: 'Lagos',
          country: 'Nigeria'
        },
        social: {
          github: 'https://github.com/makben',
          linkedin: 'https://linkedin.com/in/makben',
          twitter: 'https://twitter.com/makben',
          website: 'https://makben.vercel.app'
        },
        stats: {
          yearsOfExperience: 5,
          projectsCompleted: 25,
          certificationsEarned: 10,
          clientsSatisfied: 15
        },
        skills: {
          technical: ['Power Systems', 'AutoCAD', 'MATLAB', 'Electrical Installation'],
          soft: ['Project Management', 'Team Leadership', 'Problem Solving']
        },
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'Yoruba', proficiency: 'Fluent' }
        ],
        education: [
          {
            institution: 'University of Lagos',
            degree: 'Bachelor of Engineering',
            field: 'Electrical Engineering',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-07-01'),
            current: false
          }
        ],
        availability: 'open-to-opportunities'
      });
      console.log('✅ Profile created');
    } else {
      console.log('ℹ️ Profile already exists');
    }

    // 3. Create Skills
    const existingSkills = await Skill.find();
    if (existingSkills.length === 0) {
      const skills = [
        {
          name: 'Power Systems Design',
          category: 'technical',
          proficiency: 90,
          icon: '⚡',
          yearsOfExperience: 5
        },
        {
          name: 'Renewable Energy Systems',
          category: 'technical',
          proficiency: 85,
          icon: '☀️',
          yearsOfExperience: 4
        },
        {
          name: 'Electrical Installation',
          category: 'technical',
          proficiency: 92,
          icon: '🔌',
          yearsOfExperience: 6
        },
        {
          name: 'AutoCAD',
          category: 'software',
          proficiency: 88,
          icon: '📐',
          yearsOfExperience: 5
        },
        {
          name: 'MATLAB',
          category: 'software',
          proficiency: 80,
          icon: '📊',
          yearsOfExperience: 3
        },
        {
          name: 'Project Management',
          category: 'soft',
          proficiency: 85,
          icon: '📋',
          yearsOfExperience: 4
        }
      ];
      await Skill.insertMany(skills);
      console.log('✅ Skills created');
    } else {
      console.log('ℹ️ Skills already exist');
    }

    // 4. Create Services
    const existingServices = await Service.find();
    if (existingServices.length === 0) {
      const services = [
        {
          title: 'Power Systems Design',
          description: 'Comprehensive electrical power system design for industrial and commercial facilities.',
          icon: '⚡',
          features: ['Load Analysis', 'Circuit Design', 'Protection Schemes', 'Energy Efficiency']
        },
        {
          title: 'Renewable Energy Solutions',
          description: 'Solar and wind energy system design, installation, and maintenance services.',
          icon: '☀️',
          features: ['Solar PV Systems', 'Wind Turbines', 'Battery Storage', 'Grid Integration']
        },
        {
          title: 'Electrical Installation',
          description: 'Professional electrical installation services for residential and commercial properties.',
          icon: '🔌',
          features: ['Wiring & Cabling', 'Lighting Systems', 'Safety Compliance', 'Testing & Commissioning']
        },
        {
          title: 'Technical Consulting',
          description: 'Expert consultation on electrical engineering projects and system optimization.',
          icon: '💡',
          features: ['System Audits', 'Energy Assessment', 'Technical Reports', 'Cost Optimization']
        }
      ];
      await Service.insertMany(services);
      console.log('✅ Services created');
    } else {
      console.log('ℹ️ Services already exist');
    }

    // 5. Create Experience
    const existingExperience = await Experience.find();
    if (existingExperience.length === 0) {
      const experiences = [
        {
          position: 'Electrical Engineer',
          company: 'Nigerian Airspace Management Agency (NAMA)',
          location: 'Nigeria',
          startDate: new Date('2020-01-01'),
          current: true,
          description: 'Leading electrical engineering projects for aviation infrastructure.',
          achievements: [
            'Designed and implemented power backup systems',
            'Improved energy efficiency by 30%',
            'Managed team of 5 engineers'
          ],
          technologies: ['AutoCAD', 'MATLAB', 'Power Systems']
        }
      ];
      await Experience.insertMany(experiences);
      console.log('✅ Experience created');
    } else {
      console.log('ℹ️ Experience already exists');
    }

    // 6. Create Projects
    const existingProjects = await Project.find();
    if (existingProjects.length === 0) {
      const projects = [
        {
          title: 'Airport Power Backup System',
          description: 'Designed and installed a comprehensive UPS and generator backup system for critical airport operations. The system ensures uninterrupted power supply for navigation and communication systems.',
          shortDescription: 'UPS and generator backup system for airport operations',
          technologies: ['Power Systems', 'AutoCAD', 'Project Management'],
          imageUrl: 'https://via.placeholder.com/600x400',
          category: 'electrical',
          status: 'completed',
          featured: true,
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-12-01'),
          client: 'NAMA',
          role: 'Lead Electrical Engineer',
          challenges: ['Complex integration with existing systems', 'Strict aviation safety standards'],
          outcomes: ['99.9% system uptime', 'Zero downtime incidents']
        },
        {
          title: 'Solar Energy Installation',
          description: 'Implemented a 100kW solar PV system for a commercial building, including battery storage and grid integration. The system reduces energy costs by 40% annually.',
          shortDescription: '100kW solar PV system with battery storage',
          technologies: ['Solar PV', 'Energy Storage', 'Grid Integration'],
          imageUrl: 'https://via.placeholder.com/600x400',
          category: 'electrical',
          status: 'completed',
          featured: true,
          startDate: new Date('2023-03-01'),
          endDate: new Date('2023-08-01'),
          role: 'Solar Energy Consultant',
          challenges: ['Roof structural assessment', 'Grid synchronization'],
          outcomes: ['40% energy cost reduction', '80-ton CO2 reduction annually']
        }
      ];
      await Project.insertMany(projects);
      console.log('✅ Projects created');
    } else {
      console.log('ℹ️ Projects already exist');
    }

    // 7. Create Achievements
    const existingAchievements = await Achievement.find();
    if (existingAchievements.length === 0) {
      const achievements = [
        {
          title: 'Professional Engineer (PE) License',
          description: 'Licensed Professional Engineer in Electrical Engineering',
          date: new Date('2021-06-01'),
          category: 'certification',
          issuer: 'Council for the Regulation of Engineering in Nigeria (COREN)',
          featured: true
        },
        {
          title: 'Energy Efficiency Excellence Award',
          description: 'Recognized for outstanding contribution to energy optimization projects',
          date: new Date('2023-11-01'),
          category: 'award',
          issuer: 'NAMA',
          featured: true
        }
      ];
      await Achievement.insertMany(achievements);
      console.log('✅ Achievements created');
    } else {
      console.log('ℹ️ Achievements already exist');
    }

    console.log('\n🎉 Production database seeded successfully!');
    console.log('\n📝 Admin Login Credentials:');
    console.log('Email: admin@makben.com');
    console.log('Password: Admin@123');
    console.log('\n⚠️ Please change the admin password after first login!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit();
  }
};

seedProduction();

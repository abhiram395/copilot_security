require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Check if users already exist
    const adminExists = await User.findOne({ email: 'admin@security.com' });
    const analystExists = await User.findOne({ email: 'analyst@security.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@security.com',
        password: 'Admin123!',
        role: 'admin'
      });
      console.log('Admin user created: admin@security.com / Admin123!');
    } else {
      console.log('Admin user already exists');
    }
    
    if (!analystExists) {
      await User.create({
        name: 'Analyst User',
        email: 'analyst@security.com',
        password: 'Analyst123!',
        role: 'analyst'
      });
      console.log('Analyst user created: analyst@security.com / Analyst123!');
    } else {
      console.log('Analyst user already exists');
    }
    
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Step 1: Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Step 2: Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Step 3: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Step 4: Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    // Step 5: Save to database
    await admin.save();

    // Step 6: Show success message
    console.log('\n✅ Admin Created Successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('📧 Email:    admin@company.com');
    console.log('🔒 Password: Admin@123');
    console.log('═══════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the function
createAdmin();
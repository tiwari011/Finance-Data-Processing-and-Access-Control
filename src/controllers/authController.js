const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// REGISTER USER (Signup)
// Only Viewer and Analyst can register
// Admin CANNOT register through this route


const registerUser = async (req, res) => {
  try {
    
    // Step 1: Get data from request body
    const { name, email, password, role } = req.body;

    // Step 2: Check if all fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all fields: name, email, password, role'
      });
    }

    // Step 3: Check if role is valid (only viewer or analyst allowed)
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin registration is not allowed. Contact system administrator.'
      });
    }

    if (role !== 'viewer' && role !== 'analyst') {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Role must be viewer or analyst.'
      });
    }

    // Step 4: Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Step 5: Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Step 6: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 7: Create new user
    const newUser = new User({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
      status: 'active'
    });

    // Step 8: Save user to database
    await newUser.save();

    // Step 9: Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
};

// LOGIN USER
// All users (Viewer, Analyst, Admin) can login

const loginUser = async (req, res) => {
  try {
    
    // Step 1: Get email and password from request
    const { email, password } = req.body;

    // Step 2: Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Step 3: Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Step 4: Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Your account is deactivated. Contact administrator.'
      });
    }

    // Step 5: Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Step 6: Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Step 7: Send success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
};

// 
// REGISTER ADMIN (Secret route)
// 

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Check secret key (prevent unauthorized admin creation)
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        error: 'Invalid secret key'
      });
    }

    // Check if fields provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all fields'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',  // ← Force admin role
      status: 'active'
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update exports
module.exports = { registerUser, loginUser, registerAdmin };
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Employer } from '../models/Employer.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/logos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const register = async (req, res) => {
  try {
    const { name, email, password, employer_name } = req.body;
    
    // Trim and normalize email
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    
    // Validate required fields
    if (!name || !normalizedEmail || !password || !employer_name) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!normalizedEmail) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!employer_name) missingFields.push('employer name');
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Logo is required' });
    }

    // Check if user already exists (case-insensitive)
    const existingUser = User.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered. Please login or use a different email.' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Create user with normalized email
    const user = User.create({ name, email: normalizedEmail, password });
    
    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
    
    // Create employer
    const logoPath = `/uploads/logos/${req.file.filename}`;
    const employer = Employer.create({
      userId: user.id,
      name: employer_name,
      logo: logoPath
    });

    if (!employer) {
      return res.status(500).json({ error: 'Failed to create employer profile' });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error. Please contact administrator.' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Provide more specific error messages
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error. Please contact administrator.' });
    }

    // Normalize email (case-insensitive)
    const normalizedEmail = email.trim().toLowerCase();
    const user = User.findByEmail(normalizedEmail);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    // Provide more specific error messages
    if (error.message) {
      return res.status(500).json({ error: `Login failed: ${error.message}` });
    }
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

export const logout = (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logged out successfully' });
};


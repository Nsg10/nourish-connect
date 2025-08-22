// server/controllers/adminController.js

import User from '../models/User.js';
import Donation from '../models/Donation.js'; // ✅ Needed for donations
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(401).json({ msg: 'Unauthorized - not an admin' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ GET ALL DONATIONS
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations', error });
  }
};

// ✅ GET ALL DONORS
export const getAllDonors = async (req, res) => {
  try {
    const donors = await User.find({ role: 'DONOR' }).select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donors', error });
  }
};

// ✅ GET ALL NGOS
export const getAllNGOs = async (req, res) => {
  try {
    const ngos = await User.find({ role: 'NGO' }).select('-password');
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch NGOs', error });
  }
};

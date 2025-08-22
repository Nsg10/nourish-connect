// routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';  // make sure you have this
import User from '../models/User.js';

const router = express.Router();

// GET /api/users/me — get current user details
router.get('/me', protect(['DONOR', 'NGO']), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error("❌ Failed to fetch user:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;

// server/routes/analyticsRoutes.js
import express from 'express';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/impact-stats', async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'DONOR' });
    const totalNGOs = await User.countDocuments({ role: 'NGO' });
    const totalDonations = await Donation.countDocuments();

    const donationsByMonth = await Donation.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    res.json({
      totalDonors,
      totalNGOs,
      totalDonations,
      donationsByMonth,
    });
  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// routes/analyticsRoutes.js
router.get('/donor-impact/:id', protect(['DONOR']), async (req, res) => {
  try {
    const donorId = req.params.id;
    const donations = await Donation.find({ donor: donorId });

    const weekly = {};
    const monthly = {};

    donations.forEach(donation => {
      const date = new Date(donation.createdAt);
      const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

      weekly[week] = (weekly[week] || 0) + 1;
      monthly[month] = (monthly[month] || 0) + 1;
    });

    res.json({ weekly, monthly });
  } catch (err) {
    res.status(500).json({ msg: 'Impact data error' });
  }
});

function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
}

// GET /api/analytics/user-impact
// Returns monthly donation count for logged-in donor
router.get('/user-impact', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const pipeline = [
      { $match: { donor: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ];

    const results = await Donation.aggregate(pipeline);

    const formatted = results.map(entry => ({
      month: `${entry._id.month}/${entry._id.year}`,
      count: entry.count,
    }));

    res.json({ monthlyDonations: formatted });
  } catch (err) {
    console.error('User impact error:', err);
    res.status(500).json({ message: 'Error fetching user donation stats' });
  }
});



export default router;

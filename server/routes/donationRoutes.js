import express from 'express';
import Donation from '../models/Donation.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

/**
 * POST /donations/create
 * Donor creates a new donation
 */
router.post('/create', protect(['DONOR']), async (req, res) => {
  try {
    const { foodName, quantity, pickupTime, address, location } = req.body;

    const newDonation = await Donation.create({
      donor: req.user.id,
      foodName,
      quantity,
      pickupTime,
      address,
      location,
      status: 'Pending',
    });

    // ✅ Add points to donor after successful donation
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });

    console.log('✅ Donation created:', newDonation._id);

    // Get all NGOs
    const ngos = await User.find({ role: 'NGO' });

    if (ngos.length > 0) {
      const ngoEmails = ngos.map(ngo => ngo.email).join(',');

      await sendEmail({
        to: ngoEmails,
        subject: '🍱 New Food Donation Available',
        html: `
          <h3>New Donation Alert!</h3>
          <p><strong>Food:</strong> ${foodName}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Pickup Time:</strong> ${pickupTime}</p>
          <p><strong>Address:</strong> ${address}</p>
        `,
      });
    } else {
      console.warn('⚠️ No NGO users found to send email');
    }

    res.status(201).json({ msg: 'Donation created and NGOs notified', donation: newDonation });
  } catch (err) {
    console.error('❌ Donation create error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * GET /donations/all
 * NGO gets all pending donations
 */
router.get('/all', protect(['NGO']), async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'Pending' }).populate('donor', 'name email');
    res.json(donations);
  } catch (err) {
    console.error('❌ Error fetching donations:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * PUT /donations/accept/:id
 * NGO accepts a donation
 */
router.put('/accept/:id', protect(['NGO']), async (req, res) => {
  try {
    const donationId = req.params.id;
    const ngoId = req.user.id;

    const donation = await Donation.findById(donationId).populate('donor', 'name email');
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });

    if (donation.status === 'Accepted')
      return res.status(400).json({ msg: 'Donation already accepted' });

    donation.status = 'Accepted';
    donation.acceptedBy = ngoId;
    await donation.save();

    // Notify donor via email
    await sendEmail({
      to: donation.donor.email,
      subject: '🎉 Your Donation Was Accepted!',
      html: `
        <h3>Good News!</h3>
        <p>Your food donation <strong>"${donation.foodName}"</strong> has been accepted by an NGO.</p>
        <p>Thank you for making a difference! ❤️</p>
      `,
    });

    res.json({ msg: 'Donation accepted and donor notified', donation });
  } catch (err) {
    console.error('❌ Error accepting donation:', err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/donations/my-history
router.get('/my-history', protect(['DONOR']), async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error('Donation history fetch failed:', err);
    res.status(500).json({ message: 'Failed to load donation history' });
  }
});



export default router;

import Donation from '../models/Donation.js';

// CREATE a new donation with status set to 'Pending' ✅
export const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      quantity,
      expiresAt,
      pickupAddress,
      location
    } = req.body;

    const donation = await Donation.create({
      donor: req.user.id,
      foodName,
      quantity,
      pickupTime: expiresAt,  // ✅ match schema
      address: pickupAddress, // ✅ match schema
      location,
      status: 'Pending'
    });
    // ✅ Increment donor's coin count after donation
    await User.findByIdAndUpdate(req.user.id, { $inc: { coins: 1 } });

    res.status(201).json(donation);
  } catch (err) {
    console.error('❌ Error creating donation:', err);
    res.status(500).json({ error: err.message });
  }
};


// LIST all donations
export const listDonations = async (_req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email');

    res.json(donations);
  } catch (err) {
    console.error('❌ Error fetching donations:', err);
    res.status(500).json({ error: err.message });
  }
};

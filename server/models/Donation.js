import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: [Number], // [longitude, latitude]
    default: undefined,
    index: '2dsphere', // for geospatial queries
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Collected', 'Expired'],
    default: 'Pending',
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Donation', DonationSchema);

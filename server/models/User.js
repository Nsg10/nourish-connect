import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['DONOR', 'NGO', 'ADMIN'], required: true },
    points: {
    type: Number,
    default: 0,
  },
  },
  { timestamps: true }
);

export default model('User', userSchema);
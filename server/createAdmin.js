import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js'; // ✅ adjust path if needed

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: 'admin@nourish.com' });
    if (existingAdmin) {
      console.log('✅ Admin already exists!');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10); // 🔐 use strong password later

    const admin = new User({
      name: 'Admin',
      email: 'admin@nourish.com',
      password: hashedPassword,
      role: 'ADMIN',
    });

    await admin.save();
    console.log('🎉 Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

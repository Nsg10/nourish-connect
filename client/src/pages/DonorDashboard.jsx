import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import DonationForm from '../components/DonationForm';
import DonationHistory from '../pages/DonationHistory';
import '../styles/DonorDashboard.css'; // CSS file for styling icons and coins
import UserImpact from './UserImpact';

const DonorDashboard = () => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div>
      <h2>Hi {user?.name || 'Donor'} 👋</h2>
      <p style={{ fontWeight: "bold" }}>
        🌟 Coins Earned: {user?.points ?? 0}
      </p>

      <DonationForm onSuccess={fetchUserDetails} />
      <UserImpact userId={user?._id} />
      <DonationHistory />
    </div>
  );
};

export default DonorDashboard;

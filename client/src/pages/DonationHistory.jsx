// src/components/DonationHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donations/my-history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("📦 Donation history fetched:", res.data);
        setDonations(res.data);
      } catch (error) {
        console.error("❌ Error fetching donation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <p>Loading donation history...</p>;
  if (donations.length === 0) return <p>No donations found yet.</p>;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📝 Donation History</h3>
      <ul>
        {donations.map((donation) => (
          <li key={donation._id} style={{ marginBottom: "15px" }}>
            <strong>Food:</strong> {donation.foodName} | 
            <strong> Quantity:</strong> {donation.quantity} | 
            <strong> Status:</strong> {donation.status} | 
            <strong> Date:</strong> {new Date(donation.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationHistory;

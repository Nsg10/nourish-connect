import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserImpact() {
  const [donationStats, setDonationStats] = useState([]);

  useEffect(() => {
    const fetchUserImpact = async () => {
      try {
        const res = await axios.get('/api/analytics/user-impact', { withCredentials: true });
        setDonationStats(res.data.monthlyDonations || []);
      } catch (err) {
        console.error('Error fetching user impact:', err);
      }
    };

    fetchUserImpact();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: donationStats.map(item => item.month),
    datasets: [
      {
        label: 'Your Donations',
        data: donationStats.map(item => item.count),
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Your Monthly Donation Impact',
        font: {
          size: 18,
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">📊 Your Impact Analysis</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

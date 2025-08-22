// client/src/pages/ImpactAnalysis.jsx
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../utils/axiosInstance';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ImpactAnalysis() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState({ topDonors: [], topNGOs: [] });

  // Fetch analytics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/impact-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };
    fetchStats();
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/admin/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  if (!stats) return <div className="text-center mt-5">Loading...</div>;

  const barData = {
    labels: stats.donationsByMonth.map((entry) => entry.month),
    datasets: [
      {
        label: 'Donations Per Month',
        data: stats.donationsByMonth.map((entry) => entry.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📊 Impact Analysis</h3>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Donors</h5>
              <p className="card-text display-6">{stats.totalDonors}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total NGOs</h5>
              <p className="card-text display-6">{stats.totalNGOs}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Donations</h5>
              <p className="card-text display-6">{stats.totalDonations}</p>
            </div>
          </div>
        </div>
      </div>

      <h5>📅 Monthly Donation Trends</h5>
      <Bar data={barData} className="mb-5" />

      <h5 className="mt-4 mb-3">🏆 Leaderboards</h5>
      <div className="row">
        <div className="col-md-6">
          <h6>Top Donors</h6>
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.topDonors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No donor data</td>
                </tr>
              ) : (
                leaderboard.topDonors.map((donor, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{donor.name}</td>
                    <td>{donor.email}</td>
                    <td>{donor.coinScore}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h6>Top NGOs</h6>
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Accepted</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.topNGOs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No NGO data</td>
                </tr>
              ) : (
                leaderboard.topNGOs.map((ngo, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{ngo.name}</td>
                    <td>{ngo.email}</td>
                    <td>{ngo.acceptedDonations}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

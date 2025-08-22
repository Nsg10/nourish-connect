import { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function NGODashboard() {
  const [donations, setDonations] = useState([]);
  const [mapLocation, setMapLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Fetch all available donations
  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations/all');
      setDonations(res.data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Handle "View on Map"
  const handleViewMap = (locationArray) => {
    const [lat, lng] = locationArray;
    setMapLocation({ lat, lng });
    setShowMap(true);
  };

  // Handle "Accept Food" button click
  const handleAcceptDonation = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.put(
        `/donations/accept/${donationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('🎉 Donation accepted!');
      fetchDonations(); // refresh list after accepting
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Error accepting donation');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Available Donations</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Donor</th>
            <th>Food</th>
            <th>Qty</th>
            <th>Pickup Time</th>
            <th>Address</th>
            <th>Map</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => {
            const alreadyAccepted = Boolean(d.acceptedBy);
            return (
              <tr key={d._id}>
                <td>{d.donor?.name || 'Unknown'}</td>
                <td>{d.foodName}</td>
                <td>{d.quantity}</td>
                <td>{new Date(d.pickupTime).toLocaleString()}</td>
                <td>{d.address}</td>
                <td>
                  {Array.isArray(d.location) && d.location.length === 2 ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewMap(d.location)}
                    >
                      View on Map
                    </button>
                  ) : (
                    'No location'
                  )}
                </td>
                <td>
                  {alreadyAccepted ? (
                    <span className="text-success">✅ Already accepted</span>
                  ) : (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAcceptDonation(d._id)}
                    >
                      Accept Food
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Map Modal */}
      {showMap && mapLocation && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
          onClick={() => setShowMap(false)}
        >
          <div style={{ width: '80%', height: '70%' }}>
            <MapContainer
              center={[mapLocation.lat, mapLocation.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[mapLocation.lat, mapLocation.lng]} />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

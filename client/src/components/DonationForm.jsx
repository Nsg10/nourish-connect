// client/src/components/DonationForm.jsx
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import api from "../utils/axiosInstance";

// Component to handle search box inside map
function SearchBox({ setLocation }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      keepResult: false,
    });

    controlRef.current = searchControl;
    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      setLocation([y, x]); // GeoSearch uses {x: lng, y: lat}
    });

    return () => map.removeControl(searchControl);
  }, [map, setLocation]);

  return null;
}

// Component to select location by clicking map
function LocationSelector({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function DonationForm({ onSuccess }) {
  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    pickupTime: "",
    address: "",
  });

  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!location) {
    alert("📍 Please pin your location using the map or search bar.");
    return;
  }

  const payload = {
    ...form,
    pickupTime: new Date(form.pickupTime), // ✅ ensure it's a proper Date object
    location,
  };

  console.log("📤 Submitting donation payload:", payload);

  try {
    const token = localStorage.getItem("token");
    await api.post("/donations/create", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("✅ Donation submitted successfully!");
    if (onSuccess) onSuccess(); // 👈 trigger refresh of user data
  } catch (err) {
    console.error("❌ Error submitting donation:", err.response?.data || err.message);
    alert(err.response?.data?.msg || "Error submitting donation");
  }
};


  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h4>🍽️ Donate Food</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Food Name"
          value={form.foodName}
          onChange={(e) => setForm({ ...form, foodName: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Quantity (e.g. 10 packs)"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          type="datetime-local"
          className="form-control mb-2"
          value={form.pickupTime}
          onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Pickup Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <div className="mb-3">
          <strong>📍 Click or search to pin your location:</strong>
          <MapContainer
            center={[20.59, 78.96]}
            zoom={5}
            style={{ height: "300px", marginTop: "10px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <SearchBox setLocation={setLocation} />
            <LocationSelector setLocation={setLocation} />
            {location && <Marker position={location} />}
          </MapContainer>
        </div>

        <button className="btn btn-success w-100 mt-2">Submit Donation</button>
      </form>
    </div>
  );
}

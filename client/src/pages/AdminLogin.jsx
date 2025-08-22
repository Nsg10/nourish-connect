// src/pages/AdminLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/admin/login", { email, password });
      const token = res.data.token;

      // Store token in localStorage
      localStorage.setItem("adminToken", token);

      alert("✅ Logged in as Admin");
      navigate("/admin/dashboard"); // Redirect to admin dashboard
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Invalid admin credentials");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h4>🔐 Admin Login</h4>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

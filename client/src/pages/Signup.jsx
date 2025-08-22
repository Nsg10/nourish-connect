import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DONOR'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting signup with form:', form); // ✅ debug log
    try {
      const res = await api.post('/auth/signup', form);
      console.log('Signup success response:', res.data); // ✅ log response
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error response:', err.response); // ✅ log error
      alert(err.response?.data?.msg || 'Signup error');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h3>Signup</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="form-select mb-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="DONOR">Donor</option>
          <option value="NGO">NGO (Receiver)</option>
        </select>
        <button className="btn btn-success w-100">Sign Up</button>
      </form>
    </div>
  );
}
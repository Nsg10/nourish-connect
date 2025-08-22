import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/axiosInstance.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      const { token } = res.data;
      const role = JSON.parse(atob(token.split('.')[1])).role;
      login(token, role);
      navigate(role === 'DONOR' ? '/donor' : '/ngo', { replace: true });
    } catch (err) {
      alert(err.response?.data?.msg || 'Login error');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>

      <p className="mt-3 text-center">
        New user? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
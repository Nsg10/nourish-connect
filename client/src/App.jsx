import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import NGODashboard from './pages/NGODashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ImpactAnalysis from './pages/ImpactAnalysis';
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRoute({ children, allowed }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (allowed && !allowed.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/donor"
          element={
            <ProtectedRoute allowed={['DONOR']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo"
          element={
            <ProtectedRoute allowed={['NGO']}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/impact-analysis" element={<ImpactAnalysis />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
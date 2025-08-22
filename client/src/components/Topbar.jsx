import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { NavLink } from 'react-router-dom';

export default function Topbar() {
  const { token, role, logout } = useAuth();
  return (
    <Navbar bg="light" expand="md" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">NourishNetwork</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">About Us</Nav.Link>
            <NavLink to="/impact-analysis" className="nav-link">Impact Analysis</NavLink>
            <Nav.Link as={Link} to="/">Contact</Nav.Link>
            {token ? (
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
            {role === 'DONOR' && <Nav.Link as={Link} to="/donor">Donor Dashboard</Nav.Link>}
            {role === 'NGO' && <Nav.Link as={Link} to="/ngo">NGO Dashboard</Nav.Link>}
          
            {/* 🔐 Admin login link (visible always or conditionally if you prefer) */}
            <Nav.Link as={Link} to="/admin/login">Admin</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
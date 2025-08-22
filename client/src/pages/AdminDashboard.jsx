import { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

export default function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [donationRes, donorRes, ngoRes] = await Promise.all([
        api.get("/admin/donations", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/donors", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/ngos", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setDonations(donationRes.data);
      setDonors(donorRes.data);
      setNgos(ngoRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err.response?.data || err.message);
    }
  };

  // Sort donors and NGOs by impact
  const topDonors = [...donors].sort((a, b) => b.totalDonations - a.totalDonations).slice(0, 5);
  const topNgos = [...ngos].sort((a, b) => b.acceptedDonations - a.acceptedDonations).slice(0, 5);

  return (
    <Container className="mt-4">
      <h2>👩‍💼 Admin Dashboard</h2>

      {/* Summary Cards */}
      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Donations</Card.Title>
              <Card.Text>{donations.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Donors</Card.Title>
              <Card.Text>{donors.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total NGOs</Card.Title>
              <Card.Text>{ngos.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leaderboard: Top Donors */}
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>🏆 Top Donors</Card.Title>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Donations</th>
                  </tr>
                </thead>
                <tbody>
                  {topDonors.map((donor, idx) => (
                    <tr key={idx}>
                      <td>{donor.name}</td>
                      <td>{donor.email}</td>
                      <td>{donor.totalDonations}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Leaderboard: Top NGOs */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>🏅 Top NGOs</Card.Title>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Accepted Donations</th>
                  </tr>
                </thead>
                <tbody>
                  {topNgos.map((ngo, idx) => (
                    <tr key={idx}>
                      <td>{ngo.name}</td>
                      <td>{ngo.email}</td>
                      <td>{ngo.acceptedDonations}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

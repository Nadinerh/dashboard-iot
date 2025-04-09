import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import './Dashboard.css';
import {useNavigate}  from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const devices = [
    { name: "Capteur Température DHT11", status: "Actif", traffic: "Normal" },
    { name: "Caméra IP", status: "Actif", traffic: "Élevé" },
    { name: "ESP32 #1", status: "Inactif", traffic: "Aucun" },
  ];

  const trafficData = [
    { name: "08:00", traffic: 120 },
    { name: "10:00", traffic: 240 },
    { name: "12:00", traffic: 180 },
    { name: "14:00", traffic: 300 },
    { name: "16:00", traffic: 200 },
    { name: "18:00", traffic: 270 },
    { name: "20:00", traffic: 150 },
  ];
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="dashboard-page py-5 custom-background">
      <Container>
        <h1 className="text-center mb-4 text-primary fancy-title">Tableau de Bord</h1>

        <h3 className="mb-3 text-secondary">Trafic réseau</h3>
        <ResponsiveContainer width="100%" height={300} className="mb-5">
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="traffic" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <h3 className="mb-3 text-secondary">Appareils connectés</h3>
        <Row>
          {devices.map((device, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="shadow h-100 custom-card">
                <Card.Body>
                  <Card.Title className="text-info">{device.name}</Card.Title>
                  <Card.Text>
                    <strong>Statut :</strong> {device.status}<br />
                    <strong>Trafic :</strong> {device.traffic}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;

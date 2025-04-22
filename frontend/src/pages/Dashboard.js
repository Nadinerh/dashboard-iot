import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [donnees, setDonnees] = useState([]); // Données capteurs
  const [trafficData, setTrafficData] = useState([]); // Données trafic (optionnel)

  const devices = [
    { name: "Capteur Température DHT11", status: "Actif", traffic: "Normal" },
    { name: "Caméra IP", status: "Actif", traffic: "Élevé" },
    { name: "ESP32 #1", status: "Inactif", traffic: "Aucun" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // 🔁 Fonction pour récupérer les données capteurs toutes les 5 sec
    const fetchData = () => {
      axios.get("https://localhost:5000/api/donnees", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
      .then((res) => setDonnees(res.data))
      .catch((err) => console.error("Erreur API /donnees :", err));
    };

    // Appel immédiat + intervalle
    fetchData();
    const interval = setInterval(fetchData, 5000);

    // Appel données de trafic
    axios.get("https://localhost:5000/api/stats/hourly", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    })
    .then((res) => setTrafficData(res.data))
    .catch((err) => console.error("Erreur API /stats/hourly :", err));

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page py-5 custom-background">
      <Container>
        <h1 className="text-center mb-4 text-primary fancy-title">Tableau de Bord</h1>

        <h3 className="mb-3 text-secondary">📈 Température et Humidité</h3>
        <ResponsiveContainer width="100%" height={300} className="mb-5">
          <LineChart data={donnees.slice(-10)}> {/* On affiche les 10 dernières */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
            <YAxis />
            <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#ff6347" name="Température (°C)" />
            <Line type="monotone" dataKey="hum" stroke="#1e90ff" name="Humidité (%)" />
          </LineChart>
        </ResponsiveContainer>

        <h3 className="mb-3 text-secondary">Appareils connectés</h3>
        <Row className="mb-5">
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

        <h3 className="mb-3 text-secondary">📋 Dernières données reçues</h3>
        <ul className="list-group">
          {donnees.slice(-5).reverse().map((d, i) => (
            <li key={i} className="list-group-item">
              <strong>{new Date(d.date).toLocaleString()}</strong> — 🌡 Temp: {d.temp}°C, 💧 Hum: {d.hum}%
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
};

export default Dashboard;



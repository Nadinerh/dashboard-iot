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
  const [donnees, setDonnees] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [alerte, setAlerte] = useState("Aucune alerte détectée");

  const devices = [
    { name: "Capteur Température DHT11", status: "Actif", traffic: "Normal" },
  ];

  function LogoutButton() {
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/signout");
    };
  
    return (
      <button className="logout-btn fixed-logout" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i> Sign out
      </button>
    );
  }
  

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const apiUrl = "http://localhost:5000/api/donnees/all";
        const resDonnees = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setDonnees(resDonnees.data);

        const resTraffic = await axios.get("http://localhost:5000/api/stats/hourly", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setTrafficData(resTraffic.data);

        // Exemple : activer une alerte si une propriété attack est détectée
        if (resTraffic.data.some(entry => entry.attack === true)) {
          setAlerte("🚨 Attaque détectée sur le réseau !");
        }
      } catch (err) {
        console.error("Erreur API :", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page">
      <Container>
        <h1 className="dashboard-title">Tableau de Bord</h1>
        <div className="section-header">
        <h3 className="section-title">📈 Température et Humidité</h3>
        <div className="device-button">
          <i className="bi bi-cpu me-2"></i>
          Capteur Température DHT11 — <strong>Actif</strong>
        </div>
        </div>

        <ResponsiveContainer width="100%" height={300} className="mb-5">
          <LineChart data={donnees.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#fff" }}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#ff6347" name="Température (°C)" />
            <Line type="monotone" dataKey="hum" stroke="#1e90ff" name="Humidité (%)" />
          </LineChart>
        </ResponsiveContainer>
        <div className="alert-block mb-4">
          <i className="bi bi-shield-exclamation"></i> {alerte}
        </div>
        <h3 className="mb-3 text-secondary">📋 Dernières données reçues</h3>
        <ul className="list-group">
        {donnees.slice(-20).reverse().map((d, i) => (
            <li key={i} className="list-group-item">
              <strong>{new Date(d.date).toLocaleString()}</strong> — 🌡 Temp: {d.temp}°C, 💧 Hum: {d.hum}%
            </li>
          ))}
        </ul>
        <LogoutButton />
      </Container>
    </div>
  );
};

export default Dashboard;




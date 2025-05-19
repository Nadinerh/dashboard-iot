import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [donnees, setDonnees] = useState([]);
  const [resultatsIA, setResultatsIA] = useState([]);
  const [encryptedData, setEncryptedData] = useState([]);
  const [decryptionStatus, setDecryptionStatus] = useState("Aucun fichier");
  const [alerte, setAlerte] = useState("Aucune alerte détectée");

  const fetchAnalyseHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_IP}/api/analyse/history`);
      const history = res.data.map(entry => ({
        timestamp: new Date(entry.timestamp).toLocaleTimeString(),
        prediction: entry.prediction === "DDoS" ? 1 : 0
      }));
      setResultatsIA(history);
    } catch (err) {
      console.error("❌ Erreur récupération analyse :", err);
      setAlerte("⚠️ Erreur lors de la récupération des données IA");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const resDonnees = await axios.get(`${process.env.REACT_APP_BACKEND_IP}/api/donnees/all`, {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true
        });
        setDonnees(resDonnees.data);

        const resEncrypted = await axios.get(`${process.env.REACT_APP_BACKEND_IP}/api/upload/status`, {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true
        });
        setEncryptedData(resEncrypted.data);
        const last = resEncrypted.data[0];
        if (last) {
          setDecryptionStatus(last.status === "decrypted"
            ? "Dernières données déchiffrées avec succès"
            : "En attente de déchiffrement");
        }
      } catch (err) {
        console.error("❌ Erreur API:", err);
      }
    };

    fetchData();
    fetchAnalyseHistory();
    const interval = setInterval(() => {
      fetchData();
      fetchAnalyseHistory();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyse = () => {
    fetchAnalyseHistory(); // recharge les détections
  };

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

  return (
    <div className="dashboard-page">
      <Container>
        <LogoutButton />
        <h1 className="dashboard-title text-center mb-4 text-primary fancy-title">Tableau de Bord</h1>

        <div className="section-header">
          <h3 className="section-title">Température et Humidité</h3>
        </div>

        <ResponsiveContainer width="100%" height={300} className="mb-4">
          <LineChart data={donnees.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#fff" }}
              tickFormatter={value => new Date(value).toLocaleTimeString()} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip labelFormatter={value => new Date(value).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#ff6347" name="Température (°C)" />
            <Line type="monotone" dataKey="hum" stroke="#1e90ff" name="Humidité (%)" />
          </LineChart>
        </ResponsiveContainer>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0 text-info">Historique des détections IA</h3>
          <button className="btn btn-warning" onClick={handleAnalyse}>
            Lancer détection IA (DDoS)
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300} className="mb-5">
          <LineChart data={resultatsIA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} domain={[0, 1]} />
            <Tooltip formatter={(value) => value === 1 ? "DDoS" : "Normal"} />
            <Legend />
            <Line type="monotone" dataKey="prediction" stroke="#ff0000" name="Détection IA" dot={true} />
          </LineChart>
        </ResponsiveContainer>

        <div className="alert-block mb-4">
          <i className="bi bi-shield-exclamation"></i> {alerte}
        </div>

        <div className="encryption-status-card mb-4">
          <h3 className="section-title">
            <i className="bi bi-shield-lock"></i> État du Chiffrement
          </h3>
          <div className="status-indicator">{decryptionStatus}</div>
          <div className="encrypted-files-list">
            {encryptedData.slice(0, 5).map((file, i) => (
              <div key={i} className={`file-item ${file.status}`}>
                <span className="timestamp">{new Date(file.timestamp).toLocaleString()}</span>
                <span className="status-badge">{file.status}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mb-3 text-secondary">Dernières données reçues</h3>
        <ul className="list-group">
          {donnees.slice(-20).reverse().map((d, i) => (
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












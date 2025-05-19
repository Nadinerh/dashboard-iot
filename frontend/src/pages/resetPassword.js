import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [cle, setCle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_IP}/api/users/reset-password/${token}`, {
        password,
        cle,
      });
      alert("Mot de passe mis à jour !");
      navigate("/login");
    } catch (err) {
      console.error("Erreur :", err);
      setError(err.response?.data?.message || "Lien invalide ou clé incorrecte.");
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card-login">
        <img src="/pl.png" alt="Avatar" className="login-avatar" />
        <h2 className="text-gradient">Réinitialiser</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="input-icon">
          <i className="bi bi-lock-fill"></i>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-icon">
          <i className="bi bi-key-fill"></i>
          <input
            type="text"
            placeholder="Clé secrète"
            value={cle}
            onChange={(e) => setCle(e.target.value)}
          />
        </div>

        <button className="btn-login" onClick={handleReset}>
          Confirmer
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;





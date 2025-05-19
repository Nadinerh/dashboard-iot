import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_IP}/api/users/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      setMessage("Lien envoyé à ton email !");
    } catch (err) {
      setMessage("Utilisateur non trouvé");
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card-login">
        <img src="/pl.png" alt="User Avatar" className="login-avatar" />
        <h2 className="text-gradient">Mot de passe oublié</h2>

        <div className="input-icon">
          <i className="bi bi-envelope-fill"></i>
          <input
            type="email"
            placeholder="Ton email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn-login" onClick={handleSubmit}>
          Envoyer
        </button>

        {message && (
          <div className="alert alert-danger" style={{ marginTop: "10px" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;







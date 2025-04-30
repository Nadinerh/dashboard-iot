// src/pages/Signin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signin.css';
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignin = async () => {
    try {
      const response = await axios.post("https://your-api.com/api/users/signin", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Erreur d'inscription");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <img src="/pl.png" alt="User Avatar" className="signin-avatar" /> 
        <h2 className="signin-title">Créer un compte</h2>

        {error && <div className="alert-error">{error}</div>}

        <div className="input-icon">
          <i className="bi bi-envelope-fill"></i>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-icon">
          <i className="bi bi-lock-fill"></i>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-signin" onClick={handleSignin}>S'inscrire</button>

        <div className="link-login">
          Vous avez déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </div>
    </div>
  );
};

export default Signin;

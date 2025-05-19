import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signin.css';
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cle, setCle] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!email || !password || !cle) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_IP}/api/users/register`,
        {
          email,
          password,
          cle,
        }
      );

      alert("Inscription réussie !");
      navigate("/login");
    } catch (err) {
      console.log("Erreur backend complète :", err);
      if (err.response?.status === 403) {
        setError("Clé d'inscription invalide");
      } else {
        const msg = err.response?.data?.message || "Erreur d'inscription";
        setError(`${msg}`);
      }
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

        <div className="input-icon">
          <i className="bi bi-key-fill"></i>
          <input
            type="text"
            placeholder="Clé d'inscription"
            value={cle}
            onChange={(e) => setCle(e.target.value)}
          />
        </div>

        <button className="btn-signin" onClick={handleRegister}>
          S'inscrire
        </button>

        <div className="link-login">
          Vous avez déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </div>
    </div>
  );
};

export default Signin;



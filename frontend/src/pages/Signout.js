import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Signout.css';

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer le token
    localStorage.removeItem("token");

    // Rediriger vers login après 2 secondes
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer); // nettoyage
  }, [navigate]);

  return (
    <div className="signout-page">
      <div className="signout-box">
        <h2>Déconnexion...</h2>
        <p>Vous allez être redirigé vers la page de connexion.</p>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Signout;

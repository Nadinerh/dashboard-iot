import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-bg">
      <Container className="welcome-content animate__animated animate__fadeInUp">
        <div className="glass-card p-5 rounded-4 shadow d-flex flex-column flex-md-row align-items-center justify-content-between">
          
          {/* 🧾 Texte d’intro à gauche */}
          <div className="text-section text-start mb-4 mb-md-0">
            <h1 className="display-4 fw-bold text-white">
              Bienvenue sur notre <span className="gradient-text">plateforme</span>
            </h1>
            <p className="lead text-light mb-4">
              Découvrez nos services et accédez à votre tableau de bord.
            </p>
            <Button
              variant="success"
              size="lg"
              className="d-flex align-items-center gap-2"
              onClick={() => navigate("/login")}
            >
              Commencer <FiArrowRight />
            </Button>
          </div>

          {/* 🖼️ Illustration à droite */}
          <img
            src="/image1.png"
            alt="Illustration cybersécurité"
            className="welcome-illustration ms-md-5 mt-4 mt-md-0"
          />
        </div>
      </Container>
    </div>
  );
};

export default Welcome;






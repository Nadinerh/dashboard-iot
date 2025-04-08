import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-bg">
      <Navbar bg="light" expand="lg" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <img
              src="/logott.png"
              alt="Logo TT"
              height="40"
              className="me-2"
              style={{ borderRadius: '8px' }}
            />
            <span className="fw-bold text-primary">Tunisie Telecom</span>
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link onClick={() => navigate("/login")} className="text-secondary">My TT</Nav.Link>
            <Button variant="outline-primary" onClick={() => navigate("/login")}>Espace Entreprise</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="text-center welcome-content animate__animated animate__fadeInUp">
        <h1 className="display-4 fw-bold text-white">Bienvenue sur notre plateforme</h1>
        <p className="lead text-white-50 mb-4">
          Découvrez nos services et accédez à votre tableau de bord.
        </p>
        <Button variant="success" size="lg" onClick={() => navigate("/login")}>Commencer</Button>
      </Container>
    </div>
  );
};

export default Welcome;

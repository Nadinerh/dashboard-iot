import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FiHome, FiGrid, FiLogOut,FiLogIn } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="glass-navbar shadow-sm">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="nav-logo d-flex align-items-center gap-2">
          <img
            src="/cyber.png"
            alt="Logo"
            className="logo-img"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              <FiHome className="me-1" /> Accueil
            </Nav.Link>
            <Nav.Link as={Link} to="/login" active={location.pathname === "/login"}>
              <FiGrid className="me-1" /> Login
            </Nav.Link>
            
            <Nav.Link as={Link} to="/signin" className="signin-btn">
              <FiLogIn className="me-1" /> Sign in
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;




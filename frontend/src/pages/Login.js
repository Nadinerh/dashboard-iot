import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import './Login.css';
import axios from "axios"; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async () => {
    try {
      const response = await axios.post("https://dashboard-iot-nd3u.onrender.com/api/login", {
        email,
        password,
      });

      // Si la réponse est bonne
      console.log("Login réussi :", response.data);
      localStorage.setItem("token", response.data.token); // Stocker le token dans le localStorage
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <Card className="p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 text-primary">Connexion</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" className="w-100" onClick={handleLogin}>
            Se connecter
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

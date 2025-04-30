import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://dashboard-iot-nd3u.onrender.com/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card-login">
        <img src="/pl.png" alt="User Avatar" className="login-avatar" />
        <h2 className="text-gradient">Connexion</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="input-icon">
          <i className="bi bi-envelope-fill"></i>
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-icon">
          <i className="bi bi-lock-fill"></i>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} toggle-eye`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <div className="extra-links">
          <div className="remember-me">
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <a href="#">Forgot Password?</a>
        </div>

        <button className="btn-login" onClick={handleLogin}>LOGIN</button>
        <button className="btn-register" onClick={() => navigate("/Signin")}>REGISTER</button>
      </div>
    </div>
  );
};

export default Login;



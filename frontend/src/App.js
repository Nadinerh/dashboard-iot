import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/context.js";
import Welcome from "./pages/Welcome.js";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Header from "./pages/Header";
import Signout from "./pages/Signout.js";
import Signin from "./pages/Signin.js";
 // 🆕


const App = () => {
  return (
    <AppProvider>
      <Router>
        <Header /> {/* ✅ Global Header utilisé ici */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/signin" element={<Signin />} />

        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;

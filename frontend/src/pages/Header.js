import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ backgroundColor: '#007bff', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
      <h1 style={{ fontSize: '1.2rem' }}>Tunisie Telecom</h1>
      <nav>
        <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>Accueil</Link>
        <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
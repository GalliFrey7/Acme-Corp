// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Acme Corp</h1>
        <nav>
          <ul>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>
      <main className="home-content">
        <h1>Welcome to Acme Corp</h1>
        <p>Experience the future of virtual reality with Innovatech VR Pro.</p>
      </main>
    </div>
  );
};

export default Home;

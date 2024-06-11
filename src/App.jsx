// src/App.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div className="app ">
      <h1>Welcome to Acme Corp</h1>
      <nav>
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default App;

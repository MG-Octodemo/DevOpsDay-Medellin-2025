import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>DevOpsDays Medellín 2025</h1>
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Calendario</Link>
            </li>
            <li>
              <a href="https://devopsdays.org/medellin" target="_blank" rel="noopener noreferrer">
                Acerca del Evento
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
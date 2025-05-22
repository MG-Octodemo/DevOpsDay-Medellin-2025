import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          DevOpsDay Medellín
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Calendario
              </Link>
            </li>
            {currentUser && (
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  Mi Perfil
                </Link>
              </li>
            )}
          </ul>

          {currentUser ? (
            <div className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link">
                  {currentUser.user.username}
                </span>
              </li>
              <li className="nav-item">
                <a href="/" className="nav-link" onClick={logOut}>
                  Cerrar Sesión
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Registrarse
                </Link>
              </li>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import './RegistrationSuccessPage.css';

const RegistrationSuccessPage = () => {
  const location = useLocation();
  
  // If no state was passed, redirect to home page
  if (!location.state) {
    return <Navigate to="/" />;
  }
  
  const { talkTitle, userName, userEmail } = location.state;

  return (
    <div className="success-page container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>¡Registro Exitoso!</h1>
        <p className="success-message">
          Tu registro para la charla <strong>"{talkTitle}"</strong> ha sido confirmado.
        </p>
        
        <div className="registration-details">
          <h2>Detalles del Registro:</h2>
          <p><strong>Nombre:</strong> {userName}</p>
          <p><strong>Correo Electrónico:</strong> {userEmail}</p>
          <p><strong>Charla:</strong> {talkTitle}</p>
        </div>
        
        <p className="note">
          Se ha enviado un correo de confirmación a tu dirección de correo electrónico con los detalles de la charla.
        </p>
        
        <div className="actions">
          <Link to="/" className="btn-back">
            Volver al Calendario
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
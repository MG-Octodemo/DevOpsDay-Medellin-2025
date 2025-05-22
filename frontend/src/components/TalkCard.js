import React, { useState } from 'react';
import TalkService from '../services/talk.service';
import AuthService from '../services/auth.service';

const TalkCard = ({ talk, isRegistered, onRegister }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = AuthService.getCurrentUser();

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await TalkService.registerToTalk(talk.id);
      setSuccess('Registrado correctamente a la charla');
      setLoading(false);
      if (onRegister) {
        onRegister();
      }
    } catch (error) {
      setError(error.toString());
      setLoading(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {talk.day} | {talk.startTime} - {talk.endTime} | {talk.room}
          </small>
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">{talk.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Por: {talk.speaker}</h6>
        <p className="card-text">{talk.description}</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {currentUser ? (
          isRegistered ? (
            <button className="btn btn-success" disabled>
              Ya estás registrado
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Registrarme'}
            </button>
          )
        ) : (
          <div className="alert alert-info mt-2">
            Inicia sesión para registrarte a esta charla
          </div>
        )}
      </div>
    </div>
  );
};

export default TalkCard;

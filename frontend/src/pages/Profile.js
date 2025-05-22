import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import TalkService from '../services/talk.service';
import AuthService from '../services/auth.service';
import TalkCard from '../components/TalkCard';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await TalkService.getUserProfile();
      setProfile(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar el perfil: ' + error.toString());
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Mi Perfil</h1>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Información de Usuario</h5>
          <p className="card-text">
            <strong>Nombre de usuario:</strong> {profile.user.username}
          </p>
        </div>
      </div>

      <h2 className="mb-3">Mis Charlas Registradas</h2>
      {profile.registeredTalks.length > 0 ? (
        <div className="row">
          {profile.registeredTalks.map(talk => (
            <div className="col-md-6" key={talk.id}>
              <TalkCard talk={talk} isRegistered={true} />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          Aún no te has registrado a ninguna charla. 
          <a href="/" className="alert-link ms-1">Ver calendario de charlas</a>
        </div>
      )}
    </div>
  );
};

export default Profile;

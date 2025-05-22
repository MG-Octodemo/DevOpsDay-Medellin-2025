import React, { useState, useEffect } from 'react';
import TalkService from '../services/talk.service';
import TalkCard from '../components/TalkCard';
import AuthService from '../services/auth.service';

const Home = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userTalks, setUserTalks] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [days, setDays] = useState([]);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    fetchTalks();
    if (currentUser) {
      fetchUserProfile();
    }
  }, []);

  const fetchTalks = async () => {
    try {
      const data = await TalkService.getAllTalks();
      setTalks(data);
      
      // Extract unique days from talks
      const uniqueDays = [...new Set(data.map(talk => talk.day))];
      setDays(uniqueDays);
      
      // Set default selected day to first day
      if (uniqueDays.length > 0 && !selectedDay) {
        setSelectedDay(uniqueDays[0]);
      }
      
      setLoading(false);
    } catch (error) {
      setError('Error al cargar las charlas');
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await TalkService.getUserProfile();
      setUserTalks(data.registeredTalks.map(talk => talk.id));
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    }
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const handleRegistration = () => {
    fetchUserProfile();
  };

  const isRegistered = (talkId) => {
    return userTalks.includes(talkId);
  };

  const filteredTalks = talks.filter(talk => talk.day === selectedDay);

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
      <h1 className="mb-4">Calendario de Charlas</h1>
      
      {/* Day selector */}
      <div className="mb-4">
        <div className="btn-group" role="group">
          {days.map(day => (
            <button
              key={day}
              type="button"
              className={`btn ${selectedDay === day ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleDayChange(day)}
            >
              {new Date(day).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </button>
          ))}
        </div>
      </div>
      
      {/* Talks list */}
      <div className="row">
        {filteredTalks.length > 0 ? (
          filteredTalks.map(talk => (
            <div className="col-md-6" key={talk.id}>
              <TalkCard 
                talk={talk} 
                isRegistered={isRegistered(talk.id)}
                onRegister={handleRegistration}
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No hay charlas para este día.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

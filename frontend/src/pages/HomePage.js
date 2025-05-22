import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTalks } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        setLoading(true);
        const response = await getTalks();
        setTalks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las charlas. Por favor, intente nuevamente más tarde.');
        setLoading(false);
      }
    };

    fetchTalks();
  }, []);

  // Group talks by date
  const groupedTalks = talks.reduce((acc, talk) => {
    const date = new Date(talk.startTime).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(talk);
    return acc;
  }, {});

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Calendario de Charlas</h1>
          <p>DevOpsDays Medellín 2025</p>
        </div>
      </section>

      <section className="calendar container">
        {loading ? (
          <div className="loading">Cargando charlas...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          Object.entries(groupedTalks).map(([date, dayTalks]) => (
            <div key={date} className="calendar-day">
              <h2 className="date-heading">{date}</h2>
              
              <div className="talks-grid">
                {dayTalks.map((talk) => (
                  <div key={talk.id} className="talk-card">
                    <div className="talk-time">
                      {new Date(talk.startTime).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(talk.endTime).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <h3 className="talk-title">{talk.title}</h3>
                    <p className="talk-speaker">Por: {talk.speaker}</p>
                    <p className="talk-room">Sala: {talk.room}</p>
                    <Link to={`/talk/${talk.id}`} className="btn-details">
                      Ver Detalles
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default HomePage;
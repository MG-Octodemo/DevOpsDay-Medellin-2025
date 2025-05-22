import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTalkById, registerForTalk } from '../services/api';
import './TalkDetailsPage.css';

const TalkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [talk, setTalk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTalk = async () => {
      try {
        setLoading(true);
        const response = await getTalkById(id);
        setTalk(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles de la charla.');
        setLoading(false);
      }
    };

    fetchTalk();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm({
      ...registrationForm,
      [name]: value,
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!registrationForm.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }
    
    if (!registrationForm.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(registrationForm.email)) {
      errors.email = 'El correo electrónico no es válido';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setSubmitting(true);
      await registerForTalk({
        ...registrationForm,
        talkId: id,
      });
      
      // Redirect to success page
      navigate('/registration-success', { 
        state: { 
          talkTitle: talk.title,
          userName: registrationForm.name,
          userEmail: registrationForm.email 
        } 
      });
    } catch (err) {
      setError('Error al registrarse para la charla. Por favor, intente nuevamente.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading container">Cargando detalles de la charla...</div>;
  }

  if (error) {
    return <div className="error container">{error}</div>;
  }

  if (!talk) {
    return <div className="error container">No se encontró la charla.</div>;
  }

  return (
    <div className="talk-details-page container">
      <div className="talk-header">
        <h1>{talk.title}</h1>
        <p className="talk-meta">
          {new Date(talk.startTime).toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' | '}
          {new Date(talk.startTime).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {' - '}
          {new Date(talk.endTime).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {' | '}
          Sala: {talk.room}
        </p>
      </div>

      <div className="talk-content">
        <div className="talk-info">
          <div className="speaker-info">
            <h2>Ponente</h2>
            <p>{talk.speaker}</p>
          </div>
          
          <div className="talk-description">
            <h2>Descripción</h2>
            <p>{talk.description}</p>
          </div>
        </div>
        
        <div className="registration-form-container">
          <h2>Registrarse para esta charla</h2>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={registrationForm.name}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
              />
              {formErrors.name && <div className="error">{formErrors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={registrationForm.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
              />
              {formErrors.email && <div className="error">{formErrors.email}</div>}
            </div>
            
            <button type="submit" disabled={submitting} className="btn-register">
              {submitting ? 'Procesando...' : 'Registrarse'}
            </button>
            
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TalkDetailsPage;
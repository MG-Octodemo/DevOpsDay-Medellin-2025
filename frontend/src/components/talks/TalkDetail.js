import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Badge, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const TalkDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [talk, setTalk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  
  useEffect(() => {
    const fetchTalk = async () => {
      try {
        const res = await axios.get(`/api/talks/${id}`);
        setTalk(res.data);
        setLoading(false);
        
        // Check if user is registered to this talk
        if (isAuthenticated && user) {
          const registeredTalks = await axios.get('/api/users/registered-talks', {
            headers: {
              Authorization: `******'token')}`
            }
          });
          
          const isRegistered = registeredTalks.data.some(regTalk => regTalk.id === parseInt(id));
          setRegistered(isRegistered);
        }
      } catch (err) {
        setError('Error al cargar los datos de la charla');
        setLoading(false);
      }
    };
    
    fetchTalk();
  }, [id, isAuthenticated, user]);
  
  const registerToTalk = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setRegisterLoading(true);
    setRegisterError(null);
    
    try {
      await axios.post(`/api/users/register-talk/${id}`, {}, {
        headers: {
          Authorization: `******'token')}`
        }
      });
      
      setRegistered(true);
      setRegisterLoading(false);
    } catch (err) {
      setRegisterError('Error al registrarse a la charla');
      setRegisterLoading(false);
    }
  };
  
  const unregisterFromTalk = async () => {
    setRegisterLoading(true);
    setRegisterError(null);
    
    try {
      await axios.post(`/api/users/unregister-talk/${id}`, {}, {
        headers: {
          Authorization: `******'token')}`
        }
      });
      
      setRegistered(false);
      setRegisterLoading(false);
    } catch (err) {
      setRegisterError('Error al desregistrarse de la charla');
      setRegisterLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Cargando detalles de la charla...</Alert>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  if (!talk) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Charla no encontrada</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title className="display-5">{talk.titulo}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {new Date(talk.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | {talk.hora} | {talk.sala}
          </Card.Subtitle>
          
          <Card.Text className="lead mb-4">
            {talk.descripcion}
          </Card.Text>
          
          <Card.Text className="mb-4">
            <Badge bg="info" className="p-2 fs-6">Ponente: {talk.ponente}</Badge>
          </Card.Text>
          
          {registerError && (
            <Alert variant="danger">{registerError}</Alert>
          )}
          
          {isAuthenticated ? (
            registered ? (
              <Button 
                variant="outline-danger" 
                onClick={unregisterFromTalk}
                disabled={registerLoading}
              >
                {registerLoading ? 'Procesando...' : 'Cancelar registro'}
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={registerToTalk}
                disabled={registerLoading}
              >
                {registerLoading ? 'Procesando...' : 'Registrarme a esta charla'}
              </Button>
            )
          ) : (
            <Alert variant="info">
              Debes <a href="/login">iniciar sesión</a> para registrarte a esta charla
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TalkDetail;
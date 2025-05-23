import React, { useState, useEffect, useContext } from 'react';
import { Container, Alert, Card, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [registeredTalks, setRegisteredTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRegisteredTalks = async () => {
      try {
        const res = await axios.get('/api/users/registered-talks', {
          headers: {
            Authorization: `******'token')}`
          }
        });
        
        setRegisteredTalks(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las charlas registradas');
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchRegisteredTalks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  const unregisterFromTalk = async (talkId) => {
    try {
      await axios.post(`/api/users/unregister-talk/${talkId}`, {}, {
        headers: {
          Authorization: `******'token')}`
        }
      });
      
      // Update the list of registered talks
      setRegisteredTalks(registeredTalks.filter(talk => talk.id !== talkId));
    } catch (err) {
      setError('Error al desregistrarse de la charla');
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Debes <Link to="/login">iniciar sesión</Link> para ver tu perfil
        </Alert>
      </Container>
    );
  }
  
  if (loading) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Cargando datos de perfil...</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Mi Perfil</h2>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Información personal</Card.Title>
          <Card.Text>
            <strong>Nombre:</strong> {user?.name}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {user?.email}
          </Card.Text>
        </Card.Body>
      </Card>
      
      <h3 className="mb-3">Mis Charlas Registradas</h3>
      
      {registeredTalks.length === 0 ? (
        <Alert variant="info">
          No estás registrado a ninguna charla. <Link to="/">Ver charlas disponibles</Link>
        </Alert>
      ) : (
        <Row>
          {registeredTalks.map(talk => (
            <Col key={talk.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{talk.titulo}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(talk.fecha).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })} | {talk.hora}
                  </Card.Subtitle>
                  <Card.Text>{talk.sala}</Card.Text>
                  <Link to={`/talk/${talk.id}`} className="btn btn-info btn-sm me-2">
                    Ver detalles
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => unregisterFromTalk(talk.id)}
                  >
                    Cancelar registro
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default UserProfile;
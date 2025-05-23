import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TalkCalendar = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const res = await axios.get('/api/talks');
        // Group talks by date
        const talksByDate = res.data.reduce((acc, talk) => {
          if (!acc[talk.fecha]) {
            acc[talk.fecha] = [];
          }
          acc[talk.fecha].push(talk);
          return acc;
        }, {});
        
        setTalks(talksByDate);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las charlas');
        setLoading(false);
      }
    };
    
    fetchTalks();
  }, []);
  
  if (loading) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Cargando charlas...</Alert>
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
  
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Calendario de Charlas</h2>
      
      {Object.keys(talks).map((date) => (
        <div key={date} className="mb-5">
          <h3 className="mb-3">{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
          
          <Row>
            {talks[date].map((talk) => (
              <Col key={talk.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{talk.titulo}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {talk.hora} - {talk.sala}
                    </Card.Subtitle>
                    <Card.Text>{talk.descripcion}</Card.Text>
                    <Card.Text>
                      <Badge bg="info">{talk.ponente}</Badge>
                    </Card.Text>
                    <Link to={`/talk/${talk.id}`}>
                      <Button variant="primary" size="sm">Ver detalles</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default TalkCalendar;
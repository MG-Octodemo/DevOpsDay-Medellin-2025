import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import '../fullcalendar-overrides.css';

function Calendar() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/talks');
        setTalks(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching talks:', error);
        setError('Failed to load talks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTalks();
  }, []);

  // Convert talks to calendar events
  const events = talks.map(talk => ({
    id: talk._id,
    title: talk.title,
    start: talk.startTime,
    end: talk.endTime,
    extendedProps: {
      speakers: talk.speakers,
      description: talk.description,
      location: talk.location
    }
  }));

  // Handle event click
  const handleEventClick = (clickInfo) => {
    navigate(`/talks/${clickInfo.event.id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="calendar-container">
      <h1 className="text-3xl font-bold mb-6 text-center">DevOpsDay Medellin 2025 Schedule</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white p-4 rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridDay"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="19:00:00"
        />
      </div>
      
      {events.length === 0 && !loading && (
        <div className="text-center mt-8">
          <p className="text-gray-500">No talks scheduled yet. Check back later!</p>
        </div>
      )}
    </div>
  );
}

export default Calendar;
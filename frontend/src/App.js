import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import TalkDetailsPage from './pages/TalkDetailsPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/talk/:id" element={<TalkDetailsPage />} />
            <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
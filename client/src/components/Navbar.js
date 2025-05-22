import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-white text-xl font-bold">
            DevOpsDay Medellin 2025
          </Link>
        </div>
        
        <div className="flex space-x-4">
          <Link to="/calendar" className="text-gray-300 hover:text-white">
            Calendar
          </Link>
          
          {currentUser ? (
            <>
              <Link to="/profile" className="text-gray-300 hover:text-white">
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-300 hover:text-white cursor-pointer text-black"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
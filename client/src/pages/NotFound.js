import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to DevOpsDay Medellin 2025</h1>
        <p className="text-xl mb-8">
          Join us for an amazing conference featuring the best in DevOps practices, tools, and culture.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/calendar" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
          >
            View Schedule
          </Link>
          <Link 
            to="/signup" 
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300"
          >
            Register
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Featured Speakers</h2>
          <p className="mb-4">
            Learn from industry leaders and experts in the DevOps field who will share their knowledge and experiences.
          </p>
          <p className="text-blue-600 font-medium">
            View all speakers &rarr;
          </p>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Event Highlights</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Keynote presentations from thought leaders</li>
            <li>Interactive workshops and hands-on labs</li>
            <li>Networking opportunities with peers</li>
            <li>Exhibitor area with the latest DevOps tools</li>
          </ul>
          <p className="text-blue-600 font-medium">
            Learn more &rarr;
          </p>
        </div>
      </div>
      
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Event Details</h2>
        <div className="mb-6">
          <p className="text-xl font-medium">Date & Time</p>
          <p>March 15-16, 2025 | 9:00 AM - 5:00 PM</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-medium">Location</p>
          <p>Plaza Mayor Convention Center</p>
          <p>Calle 41 #55-80, Medellin, Colombia</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
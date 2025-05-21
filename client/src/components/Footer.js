import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">DevOpsDay Medellin 2025</h3>
            <p className="mt-2">Join us for an amazing event of learning and networking!</p>
          </div>
          
          <div>
            <ul className="flex flex-wrap justify-center space-x-4">
              <li>
                <a href="#" className="hover:text-gray-300">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} DevOpsDay Medellin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
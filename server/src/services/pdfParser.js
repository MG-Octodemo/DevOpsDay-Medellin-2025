const axios = require('axios');
const pdfParse = require('pdf-parse');
const Talk = require('../models/talk');

/**
 * Fetches and parses the agenda PDF from the official URL
 * Extracts talk data and stores it in the database
 */
exports.parseAgendaFromPdf = async () => {
  try {
    // URL to the agenda PDF
    const pdfUrl = 'https://devopsdays.io/agenda-2025';
    
    // Fetch the PDF file
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data);
    
    // Parse the PDF content
    const pdfData = await pdfParse(pdfBuffer);
    
    // Extract talk information using regex patterns
    const talks = extractTalksFromPdfText(pdfData.text);
    
    // Store talks in the database
    await storeTalksInDatabase(talks);
    
    return talks;
  } catch (error) {
    console.error('Error parsing agenda PDF:', error);
    throw error;
  }
};

/**
 * Extract talk information from PDF text using regex patterns
 * @param {string} pdfText - The extracted text from the PDF
 * @returns {Array} - Array of talk objects
 */
function extractTalksFromPdfText(pdfText) {
  // This is a simplified example - actual implementation would need
  // to be tailored to the specific format of the PDF
  
  const talks = [];
  
  // Example regex pattern for a talk entry
  // Format: TIME - TITLE - SPEAKER(S)
  const talkPattern = /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*([^-]+)\s*-\s*(.+)/gi;
  
  let match;
  while ((match = talkPattern.exec(pdfText)) !== null) {
    const startTime = match[1];
    const endTime = match[2];
    const title = match[3].trim();
    const speakersText = match[4].trim();
    
    // Parse speakers
    const speakers = speakersText.split(',').map(speaker => ({
      name: speaker.trim(),
      bio: '',
      photo: ''
    }));
    
    // Create talk object
    const talk = {
      title,
      description: 'Description will be added later',
      speakers,
      startTime: parseTimeString(startTime),
      endTime: parseTimeString(endTime),
      location: 'Main Hall',
      maxAttendees: null,
      tags: []
    };
    
    talks.push(talk);
  }
  
  return talks;
}

/**
 * Parse time string to Date object
 * This is a simplified example and may need to be adjusted
 * @param {string} timeString - Time string like "10:00 AM"
 * @returns {Date} - Date object
 */
function parseTimeString(timeString) {
  // Assuming the conference is on March 15-16, 2025
  const dateString = timeString.includes('AM') || 
    (timeString.includes('PM') && timeString.startsWith('12')) 
    ? '2025-03-15' 
    : '2025-03-16';
  
  return new Date(`${dateString} ${timeString}`);
}

/**
 * Store the extracted talks in the database
 * @param {Array} talks - Array of talk objects
 */
async function storeTalksInDatabase(talks) {
  try {
    // Delete all existing talks first
    await Talk.deleteMany({});
    
    // Insert the new talks
    await Talk.insertMany(talks);
    
    console.log(`Successfully stored ${talks.length} talks in the database`);
  } catch (error) {
    console.error('Error storing talks in database:', error);
    throw error;
  }
}

/**
 * Get mock data for development purposes
 * This can be used when the PDF is not available or for testing
 */
exports.getMockTalks = async () => {
  // Conference dates: March 15-16, 2025
  const day1 = new Date('2025-03-15');
  const day2 = new Date('2025-03-16');
  
  const mockTalks = [
    {
      title: 'Opening Keynote: The Future of DevOps',
      description: 'A look at where the DevOps movement is heading and what to expect in the coming years.',
      speakers: [
        {
          name: 'Maria Rodriguez',
          bio: 'CTO at TechFusion, with 15+ years of DevOps experience',
          photo: ''
        }
      ],
      startTime: new Date(day1.setHours(9, 0)),
      endTime: new Date(day1.setHours(10, 0)),
      location: 'Main Hall',
      maxAttendees: null,
      tags: ['Keynote', 'Future', 'Trends']
    },
    {
      title: 'Kubernetes at Scale: Lessons Learned',
      description: 'How to manage large Kubernetes clusters and what we learned the hard way.',
      speakers: [
        {
          name: 'Carlos Mendez',
          bio: 'Lead Platform Engineer at CloudScale',
          photo: ''
        },
        {
          name: 'Ana Silva',
          bio: 'Kubernetes Specialist',
          photo: ''
        }
      ],
      startTime: new Date(day1.setHours(10, 30)),
      endTime: new Date(day1.setHours(11, 30)),
      location: 'Tech Room A',
      maxAttendees: 100,
      tags: ['Kubernetes', 'Cloud', 'Scaling']
    },
    {
      title: 'CI/CD Pipeline Automation Best Practices',
      description: 'Learn how to build robust and efficient CI/CD pipelines for your projects.',
      speakers: [
        {
          name: 'Diego Ramirez',
          bio: 'DevOps Engineer at GitFlow',
          photo: ''
        }
      ],
      startTime: new Date(day1.setHours(13, 0)),
      endTime: new Date(day1.setHours(14, 0)),
      location: 'Workshop Room B',
      maxAttendees: 50,
      tags: ['CI/CD', 'Automation', 'Best Practices']
    },
    {
      title: 'Infrastructure as Code with Terraform',
      description: 'Deep dive into managing infrastructure using Terraform.',
      speakers: [
        {
          name: 'Laura Gomez',
          bio: 'Cloud Infrastructure Architect',
          photo: ''
        }
      ],
      startTime: new Date(day1.setHours(14, 30)),
      endTime: new Date(day1.setHours(15, 30)),
      location: 'Tech Room A',
      maxAttendees: 80,
      tags: ['IaC', 'Terraform', 'Cloud']
    },
    {
      title: 'Observability and Monitoring in Microservices',
      description: 'How to implement effective monitoring for complex microservice architectures.',
      speakers: [
        {
          name: 'Javier Torres',
          bio: 'SRE at DataObserve',
          photo: ''
        }
      ],
      startTime: new Date(day2.setHours(9, 30)),
      endTime: new Date(day2.setHours(10, 30)),
      location: 'Main Hall',
      maxAttendees: 120,
      tags: ['Monitoring', 'Microservices', 'Observability']
    },
    {
      title: 'DevSecOps: Integrating Security into the Pipeline',
      description: 'Learn how to build security into every step of your development process.',
      speakers: [
        {
          name: 'Sofia Martinez',
          bio: 'Security Engineer at SecDevCorp',
          photo: ''
        }
      ],
      startTime: new Date(day2.setHours(11, 0)),
      endTime: new Date(day2.setHours(12, 0)),
      location: 'Workshop Room C',
      maxAttendees: 60,
      tags: ['Security', 'DevSecOps', 'Pipelines']
    },
    {
      title: 'Serverless Architecture Patterns',
      description: 'Explore common patterns and best practices for serverless applications.',
      speakers: [
        {
          name: 'Pedro Hernandez',
          bio: 'Solutions Architect at ServerStack',
          photo: ''
        }
      ],
      startTime: new Date(day2.setHours(13, 30)),
      endTime: new Date(day2.setHours(14, 30)),
      location: 'Tech Room B',
      maxAttendees: 70,
      tags: ['Serverless', 'Architecture', 'AWS Lambda']
    },
    {
      title: 'Closing Panel: The DevOps Community in Latin America',
      description: 'A discussion with leaders about the growth of DevOps practices in the region.',
      speakers: [
        {
          name: 'Multiple Speakers',
          bio: 'Various industry leaders',
          photo: ''
        }
      ],
      startTime: new Date(day2.setHours(16, 0)),
      endTime: new Date(day2.setHours(17, 0)),
      location: 'Main Hall',
      maxAttendees: null,
      tags: ['Panel', 'Community', 'Latin America']
    }
  ];
  
  return mockTalks;
};
// In-memory store for talks
class TalkStore {
  constructor() {
    this.talks = new Map();
    this.counter = 1;
  }

  // Generate unique ID
  generateId() {
    return (this.counter++).toString();
  }

  // Create a new talk
  create(talkData) {
    const id = this.generateId();
    const timestamp = new Date();
    
    const talk = {
      id,
      ...talkData,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.talks.set(id, talk);
    return talk;
  }

  // Find a talk by ID
  findById(id) {
    return this.talks.get(id) || null;
  }

  // Find all talks
  findAll() {
    return Array.from(this.talks.values());
  }

  // Update a talk
  update(id, updates) {
    const talk = this.talks.get(id);
    if (!talk) return null;

    const updatedTalk = {
      ...talk,
      ...updates,
      updatedAt: new Date()
    };

    this.talks.set(id, updatedTalk);
    return updatedTalk;
  }

  // Delete a talk
  delete(id) {
    if (!this.talks.has(id)) return false;
    return this.talks.delete(id);
  }

  // Find talks by query (simple filtering)
  find(query = {}) {
    const results = [];
    for (const talk of this.talks.values()) {
      let match = true;
      
      // Check if all query conditions match
      for (const [key, value] of Object.entries(query)) {
        if (talk[key] !== value) {
          match = false;
          break;
        }
      }
      
      if (match) {
        results.push(talk);
      }
    }
    
    return results;
  }

  // Populate the store with DevOpsDay Medellin 2025 talks from the agenda
  populateWithMockData() {
    const mockTalks = [
      {
        title: 'Opening Keynote: DevOps Evolution in 2025',
        description: 'A comprehensive overview of how DevOps practices have evolved and what to expect in the near future.',
        speakers: [
          {
            name: 'Maria Rodriguez',
            bio: 'DevOps thought leader and CTO of CloudNative Solutions',
            photo: 'https://example.com/maria.jpg'
          }
        ],
        startTime: new Date('2025-07-15T09:00:00'),
        endTime: new Date('2025-07-15T10:00:00'),
        location: 'Main Hall',
        maxAttendees: 250,
        tags: ['DevOps', 'Future Trends', 'Keynote']
      },
      {
        title: 'GitOps in Practice: Advanced Automation Techniques',
        description: 'Learn how leading organizations are implementing GitOps to manage their infrastructure and deployments.',
        speakers: [
          {
            name: 'Carlos Gomez',
            bio: 'Lead DevOps Engineer at TechInnovate',
            photo: 'https://example.com/carlos.jpg'
          }
        ],
        startTime: new Date('2025-07-15T10:30:00'),
        endTime: new Date('2025-07-15T11:30:00'),
        location: 'Workshop Room A',
        maxAttendees: 100,
        tags: ['GitOps', 'Automation', 'CI/CD']
      },
      {
        title: 'Kubernetes Security Best Practices for 2025',
        description: 'A deep dive into securing your Kubernetes clusters against the latest threats.',
        speakers: [
          {
            name: 'Laura Vega',
            bio: 'Security Specialist and Kubernetes Certified Administrator',
            photo: 'https://example.com/laura.jpg'
          }
        ],
        startTime: new Date('2025-07-15T10:30:00'),
        endTime: new Date('2025-07-15T11:30:00'),
        location: 'Workshop Room B',
        maxAttendees: 100,
        tags: ['Kubernetes', 'Security', 'Best Practices']
      },
      {
        title: 'AI-Powered DevOps: From Myth to Reality',
        description: 'Explore real-world implementations of AI in DevOps workflows and how they're changing the landscape.',
        speakers: [
          {
            name: 'Alejandro Restrepo',
            bio: 'AI Engineer and DevOps Consultant',
            photo: 'https://example.com/alejandro.jpg'
          }
        ],
        startTime: new Date('2025-07-15T12:00:00'),
        endTime: new Date('2025-07-15T13:00:00'),
        location: 'Main Hall',
        maxAttendees: 200,
        tags: ['AI', 'Machine Learning', 'DevOps']
      },
      {
        title: 'Lunch Break & Networking',
        description: 'Enjoy lunch and connect with other attendees.',
        speakers: [],
        startTime: new Date('2025-07-15T13:00:00'),
        endTime: new Date('2025-07-15T14:00:00'),
        location: 'Dining Area',
        maxAttendees: 300,
        tags: ['Networking', 'Break']
      },
      {
        title: 'Serverless DevOps: Beyond the Hype',
        description: 'Practical insights on implementing DevOps practices in serverless architectures.',
        speakers: [
          {
            name: 'Isabella Martinez',
            bio: 'Serverless Advocate and Solutions Architect',
            photo: 'https://example.com/isabella.jpg'
          }
        ],
        startTime: new Date('2025-07-15T14:00:00'),
        endTime: new Date('2025-07-15T15:00:00'),
        location: 'Workshop Room A',
        maxAttendees: 120,
        tags: ['Serverless', 'FaaS', 'Cloud Native']
      },
      {
        title: 'DevSecOps: Integrating Security Throughout the Pipeline',
        description: 'How to build security into every step of your development pipeline without sacrificing speed.',
        speakers: [
          {
            name: 'Manuel Torres',
            bio: 'Chief Security Officer at SecDevOps Inc.',
            photo: 'https://example.com/manuel.jpg'
          }
        ],
        startTime: new Date('2025-07-15T14:00:00'),
        endTime: new Date('2025-07-15T15:00:00'),
        location: 'Workshop Room B',
        maxAttendees: 120,
        tags: ['DevSecOps', 'Security', 'Compliance']
      },
      {
        title: 'Observability in Distributed Systems',
        description: 'Modern approaches to gaining visibility into complex, distributed applications.',
        speakers: [
          {
            name: 'Sofia Herrera',
            bio: 'SRE Lead at MegaCloud',
            photo: 'https://example.com/sofia.jpg'
          }
        ],
        startTime: new Date('2025-07-15T15:30:00'),
        endTime: new Date('2025-07-15T16:30:00'),
        location: 'Main Hall',
        maxAttendees: 180,
        tags: ['Observability', 'Monitoring', 'SRE']
      },
      {
        title: 'Workshop: Chaos Engineering for Resilient Systems',
        description: 'Hands-on workshop on implementing chaos engineering principles to build more resilient systems.',
        speakers: [
          {
            name: 'Diego Moreno',
            bio: 'Chaos Engineering Expert and System Architect',
            photo: 'https://example.com/diego.jpg'
          }
        ],
        startTime: new Date('2025-07-15T15:30:00'),
        endTime: new Date('2025-07-15T17:00:00'),
        location: 'Workshop Room A',
        maxAttendees: 50,
        tags: ['Chaos Engineering', 'Resilience', 'Workshop']
      },
      {
        title: 'The Future of DevOps: Panel Discussion',
        description: 'Industry leaders discuss where DevOps is headed and what skills will be most valuable.',
        speakers: [
          {
            name: 'Maria Rodriguez',
            bio: 'DevOps thought leader and CTO of CloudNative Solutions',
            photo: 'https://example.com/maria.jpg'
          },
          {
            name: 'Carlos Gomez',
            bio: 'Lead DevOps Engineer at TechInnovate',
            photo: 'https://example.com/carlos.jpg'
          },
          {
            name: 'Sofia Herrera',
            bio: 'SRE Lead at MegaCloud',
            photo: 'https://example.com/sofia.jpg'
          }
        ],
        startTime: new Date('2025-07-15T17:30:00'),
        endTime: new Date('2025-07-15T18:30:00'),
        location: 'Main Hall',
        maxAttendees: 250,
        tags: ['Panel', 'Future Trends', 'Career Development']
      },
      {
        title: 'Closing Remarks & Networking Reception',
        description: 'Wrap-up of the day's events and networking with drinks and appetizers.',
        speakers: [
          {
            name: 'Event Organizers',
            bio: 'DevOpsDay Medellin 2025 Committee',
            photo: 'https://example.com/organizers.jpg'
          }
        ],
        startTime: new Date('2025-07-15T18:30:00'),
        endTime: new Date('2025-07-15T20:00:00'),
        location: 'Reception Hall',
        maxAttendees: 300,
        tags: ['Networking', 'Social', 'Closing']
      }
    ];

    mockTalks.forEach(talk => this.create(talk));
  }
}

// Create and export a singleton instance
const talksStore = new TalkStore();

// Populate with data from the DevOpsDay Medellin 2025 agenda
talksStore.populateWithMockData();

module.exports = talksStore;

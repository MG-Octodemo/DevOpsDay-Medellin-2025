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

  // Populate the store with initial data
  populateWithMockData() {
    const mockTalks = [
      {
        title: 'DevOps in 2025: Future Trends',
        description: 'A look at emerging DevOps practices and how they will shape the industry in 2025 and beyond.',
        speakers: [
          {
            name: 'Maria Rodriguez',
            bio: 'DevOps thought leader and author of "The Future of DevOps"',
            photo: 'https://example.com/maria.jpg'
          }
        ],
        startTime: new Date('2025-07-15T09:00:00'),
        endTime: new Date('2025-07-15T10:30:00'),
        location: 'Main Hall',
        maxAttendees: 200,
        tags: ['DevOps', 'Future Trends', 'Automation']
      },
      {
        title: 'Kubernetes at Scale',
        description: 'Learn how to manage Kubernetes clusters with thousands of services efficiently.',
        speakers: [
          {
            name: 'Carlos Gomez',
            bio: 'Cloud architect with 10+ years of experience in container orchestration',
            photo: 'https://example.com/carlos.jpg'
          }
        ],
        startTime: new Date('2025-07-15T11:00:00'),
        endTime: new Date('2025-07-15T12:30:00'),
        location: 'Workshop Room A',
        maxAttendees: 100,
        tags: ['Kubernetes', 'Containers', 'Scalability']
      },
      {
        title: 'CI/CD Pipeline Optimization',
        description: 'Strategies to make your CI/CD pipelines faster, more reliable, and more secure.',
        speakers: [
          {
            name: 'Laura Vega',
            bio: 'Lead DevOps Engineer at TechCorp',
            photo: 'https://example.com/laura.jpg'
          }
        ],
        startTime: new Date('2025-07-15T14:00:00'),
        endTime: new Date('2025-07-15T15:30:00'),
        location: 'Main Hall',
        maxAttendees: 150,
        tags: ['CI/CD', 'Pipelines', 'Optimization']
      }
    ];

    mockTalks.forEach(talk => this.create(talk));
  }
}

// Create and export a singleton instance
const talksStore = new TalkStore();

// Populate with mock data
talksStore.populateWithMockData();

module.exports = talksStore;
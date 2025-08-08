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
    // Map 'id' to '_id' for frontend compatibility
    return Array.from(this.talks.values()).map(talk => ({
      ...talk,
      _id: talk.id
    }));
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
        title: 'Apertura y Bienvenida',
        description: 'Comité Organizador DevOpsDay Medellín',
        speakers: [],
        startTime: new Date('2025-05-22T09:00:00'),
        endTime: new Date('2025-05-22T09:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Apertura']
      },
      {
        title: 'The Power of AI in Cloud Reliability Engineering (CRE)',
        description: 'Carlos Rojas, Autor del libro: Reliability Engineering in the Cloud: Strategies and Practices for AI-powered Cloud-based Systems',
        speakers: [
          { name: 'Carlos Rojas', bio: 'Autor y Experto en CRE', photo: '' }
        ],
        startTime: new Date('2025-05-22T09:25:00'),
        endTime: new Date('2025-05-22T09:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Keynote', 'AI', 'Cloud', 'Reliability']
      },
      {
        title: '30 Years of MySQL: The Present and the Future',
        description: 'Juliano Faloco - Director MySQL Heatwave-Oracle',
        speakers: [
          { name: 'Juliano Faloco', bio: 'Director MySQL Heatwave-Oracle', photo: '' }
        ],
        startTime: new Date('2025-05-22T10:00:00'),
        endTime: new Date('2025-05-22T10:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['MySQL', 'Database']
      },
      {
        title: 'GENAI EN SEGURIDAD: ¿Cómo podemos usar la IA para optimizar los procesos sin poner en riesgo la seguridad?',
        description: 'Juan Carlos Restrepo - Fluid Attacks',
        speakers: [
          { name: 'Juan Carlos Restrepo', bio: 'Fluid Attacks', photo: '' }
        ],
        startTime: new Date('2025-05-22T11:00:00'),
        endTime: new Date('2025-05-22T11:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['AI', 'Security']
      },
      {
        title: 'The Kubernetes Jedi: Mastering the Force of Scalable Leadership',
        description: 'Lukasz Niedzwiedzki (Polonia), Cesar Martinez (Mexico), Fabian Novoa (Colombia)',
        speakers: [
          { name: 'Lukasz Niedzwiedzki', bio: 'E. & LATAM Cloud & DevOps Practice Director', photo: '' },
          { name: 'Cesar Martinez', bio: 'LATAM Cloud & DevOps Practice Lead', photo: '' },
          { name: 'Fabian Novoa', bio: 'Colombia: Gloablm Cloud & DevOps Cluster Lead - softserve', photo: '' }
        ],
        startTime: new Date('2025-05-22T11:30:00'),
        endTime: new Date('2025-05-22T11:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Kubernetes', 'Leadership']
      },
      {
        title: 'La Revolución de Agentes Llega a GitHub Copilot',
        description: 'Mabel Gerónimo - GitHub',
        speakers: [
          { name: 'Mabel Gerónimo', bio: 'GitHub', photo: '' }
        ],
        startTime: new Date('2025-05-22T14:30:00'),
        endTime: new Date('2025-05-22T14:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['GitHub', 'AI', 'Copilot']
      },
      {
        title: 'Dominando a Hydra: Encontrando Fluidez en las Batallas Interminables de Kubernetes',
        description: 'Johny Jiménez - Sonda',
        speakers: [
          { name: 'Johny Jiménez', bio: 'Sonda', photo: '' }
        ],
        startTime: new Date('2025-05-22T15:00:00'),
        endTime: new Date('2025-05-22T15:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Kubernetes']
      },
      {
        title: 'El Camino Hacia DevSecOps Capítulo II: Gobernanza',
        description: 'Alejandro Enciso - Lugapel Cybersecurity Advisory',
        speakers: [
          { name: 'Alejandro Enciso', bio: 'Lugapel Cybersecurity Advisory', photo: '' }
        ],
        startTime: new Date('2025-05-22T15:30:00'),
        endTime: new Date('2025-05-22T15:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['DevSecOps', 'Governance']
      },
      {
        title: 'IA: ¿Dentro o fuera de la Matrix? Descubre los peligros y las defensas!',
        description: 'Ivan Dario Sanchez - NTT Data',
        speakers: [
          { name: 'Ivan Dario Sanchez', bio: 'NTT Data', photo: '' }
        ],
        startTime: new Date('2025-05-22T16:00:00'),
        endTime: new Date('2025-05-22T16:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['AI', 'Security']
      },
      {
        title: 'DevSecOps en Acción: Del Concepto a la Práctica',
        description: 'Celia Altamirano - Ingeniera DevOps',
        speakers: [
          { name: 'Celia Altamirano', bio: 'Ingeniera DevOps', photo: '' }
        ],
        startTime: new Date('2025-05-22T16:30:00'),
        endTime: new Date('2025-05-22T16:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['DevSecOps']
      },
      {
        title: 'Navegando la Complejidad: Observabilidad e Ingeniería del Caos en Sistemas Distribuidos',
        description: 'Mateo Zapata - EPAM',
        speakers: [
          { name: 'Mateo Zapata', bio: 'EPAM', photo: '' }
        ],
        startTime: new Date('2025-05-22T17:00:00'),
        endTime: new Date('2025-05-22T17:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Observability', 'Chaos Engineering']
      },
      {
        title: 'Keynote de Cierre',
        description: 'Juan A. Garcia - Managing Director at Accenture',
        speakers: [
          { name: 'Juan A. Garcia', bio: 'Managing Director at Accenture', photo: '' }
        ],
        startTime: new Date('2025-05-22T17:30:00'),
        endTime: new Date('2025-05-22T17:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Keynote', 'Accenture']
      },
      {
        title: 'Cierre del Evento - Comité Organizador',
        description: '',
        speakers: [],
        startTime: new Date('2025-05-22T18:00:00'),
        endTime: new Date('2025-05-22T18:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Cierre']
      },
      // --- Talks for May 23, 2025 ---
      {
        title: 'Apertura y Bienvenida',
        description: 'Comité Organizador DevOpsDay Medellín',
        speakers: [],
        startTime: new Date('2025-05-23T09:00:00'),
        endTime: new Date('2025-05-23T09:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Apertura']
      },
      {
        title: 'Explotando el Potencial de las GPUs: Arquitectura, Paralelismo y Rendimiento',
        description: 'Valentina Ferruere - ORACLE',
        speakers: [
          { name: 'Valentina Ferruere', bio: 'Artificial Intelligence Engineer, ORACLE', photo: '' }
        ],
        startTime: new Date('2025-05-23T09:25:00'),
        endTime: new Date('2025-05-23T09:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['GPU', 'AI', 'Oracle']
      },
      {
        title: 'Power Skills: El Super Poder del Nuevo Talento',
        description: 'Heimar Vega - Head of global delivery network devops at NTT DATA',
        speakers: [
          { name: 'Heimar Vega', bio: 'Head of global delivery network devops at NTT DATA', photo: '' }
        ],
        startTime: new Date('2025-05-23T10:00:00'),
        endTime: new Date('2025-05-23T10:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Skills', 'Talent']
      },
      {
        title: 'Desarrollo de Aplicaciones Hecho Magia',
        description: 'Jennifer Pérez - CTO y Cofundadora Devco',
        speakers: [
          { name: 'Jennifer Pérez', bio: 'CTO y Cofundadora Devco', photo: '' }
        ],
        startTime: new Date('2025-05-23T11:00:00'),
        endTime: new Date('2025-05-23T11:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Desarrollo', 'Aplicaciones']
      },
      {
        title: 'ASPM: Más Allá de las Vulnerabilidades',
        description: 'Ronen Riesenfeld - Solutions engineer at CHECKMARX',
        speakers: [
          { name: 'Ronen Riesenfeld', bio: 'Solutions engineer at CHECKMARX', photo: '' }
        ],
        startTime: new Date('2025-05-23T11:30:00'),
        endTime: new Date('2025-05-23T11:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['ASPM', 'Vulnerabilidades', 'Checkmarx']
      },
      // --- Parallel Tracks (14:30-15:55, 16:00-16:55) ---
      // Add a few representative parallel talks for brevity
      {
        title: 'Stop the Networking Chaos, Secure & Optimize AWS Networking with Centralized Architecture',
        description: 'AWS devops technical leader',
        speakers: [
          { name: 'AWS devops technical leader', bio: '', photo: '' }
        ],
        startTime: new Date('2025-05-23T14:30:00'),
        endTime: new Date('2025-05-23T14:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['AWS', 'Networking']
      },
      {
        title: 'DevOps y Observabilidad en los Tiempos de la IA',
        description: 'Stevenson Ramírez - DYNATRACE',
        speakers: [
          { name: 'Stevenson Ramírez', bio: 'DYNATRACE', photo: '' }
        ],
        startTime: new Date('2025-05-23T15:00:00'),
        endTime: new Date('2025-05-23T15:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['DevOps', 'Observabilidad', 'IA']
      },
      {
        title: 'Mis Aplicaciones Hablan: Fortalece DevOps con Observabilidad Inteligente',
        description: 'Guillermo Penagos - ELASTIC',
        speakers: [
          { name: 'Guillermo Penagos', bio: 'ELASTIC', photo: '' }
        ],
        startTime: new Date('2025-05-23T15:30:00'),
        endTime: new Date('2025-05-23T15:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['DevOps', 'Observabilidad', 'Elastic']
      },
      {
        title: 'Agilidad más allá del Framework: Liderazgo y Cultura en la Transformación Digital',
        description: 'Carlos Tangua - NTT DATA',
        speakers: [
          { name: 'Carlos Tangua', bio: 'NTT DATA', photo: '' }
        ],
        startTime: new Date('2025-05-23T16:00:00'),
        endTime: new Date('2025-05-23T16:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Agilidad', 'Transformación Digital']
      },
      {
        title: 'Revolución Agentic AI',
        description: 'Andres Perez, Felipe Mejía - MICROSOFT',
        speakers: [
          { name: 'Andres Perez', bio: 'MICROSOFT', photo: '' },
          { name: 'Felipe Mejía', bio: 'MICROSOFT', photo: '' }
        ],
        startTime: new Date('2025-05-23T16:30:00'),
        endTime: new Date('2025-05-23T16:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['AI', 'Microsoft', 'Agentic']
      },
      {
        title: 'Redefining Hyper-Efficiency in the Digital Age',
        description: 'Felipe Ospina - CI&T',
        speakers: [
          { name: 'Felipe Ospina', bio: 'CI&T', photo: '' }
        ],
        startTime: new Date('2025-05-23T17:00:00'),
        endTime: new Date('2025-05-23T17:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Efficiency', 'Digital Age']
      },
      {
        title: 'Keynote de Cierre',
        description: 'Andres Barrantes - CEO & Cofounder at NUUVU',
        speakers: [
          { name: 'Andres Barrantes', bio: 'CEO & Cofounder at NUUVU', photo: '' }
        ],
        startTime: new Date('2025-05-23T17:30:00'),
        endTime: new Date('2025-05-23T17:55:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Keynote', 'NUUVU']
      },
      {
        title: 'Cierre del Evento - Comité Organizador',
        description: '',
        speakers: [],
        startTime: new Date('2025-05-23T18:00:00'),
        endTime: new Date('2025-05-23T18:25:00'),
        location: 'Teatro Mayor San José',
        maxAttendees: null,
        tags: ['Cierre']
      },
      // --- Talks for May 24, 2025 ---
      {
        title: 'Apertura y Bienvenida U de A',
        description: 'Comité Organizador DevOpsDay Medellín',
        speakers: [],
        startTime: new Date('2025-05-24T09:00:00'),
        endTime: new Date('2025-05-24T09:25:00'),
        location: 'Teatro Universitario',
        maxAttendees: null,
        tags: ['Apertura']
      },
      {
        title: 'Exploring the Convergence of Machine Learning, AI, DevOps, and Cloud-Native Technologies in Automation',
        description: 'Ben N Savage - CEO & Founder VERITAS AUTOMATA',
        speakers: [
          { name: 'Ben N Savage', bio: 'CEO & Founder VERITAS AUTOMATA', photo: '' }
        ],
        startTime: new Date('2025-05-24T09:25:00'),
        endTime: new Date('2025-05-24T09:55:00'),
        location: 'Teatro Universitario',
        maxAttendees: null,
        tags: ['AI', 'DevOps', 'Cloud-Native', 'Automation']
      },
      {
        title: 'Security/Chaos: Infrastructure Has Fallen',
        description: 'Axel Laburna - DevOps Lead & DevOps Institute Ambassador',
        speakers: [
          { name: 'Axel Laburna', bio: 'DevOps Lead & DevOps Institute Ambassador', photo: '' }
        ],
        startTime: new Date('2025-05-24T10:00:00'),
        endTime: new Date('2025-05-24T10:25:00'),
        location: 'Teatro Universitario',
        maxAttendees: null,
        tags: ['Security', 'Chaos Engineering']
      },
      // Add a few representative parallel talks for May 24 (10:30-16:55)
      {
        title: 'BIZOPS',
        description: 'Ivan Dario Sanchez - NTT DATA',
        speakers: [
          { name: 'Ivan Dario Sanchez', bio: 'NTT DATA', photo: '' }
        ],
        startTime: new Date('2025-05-24T10:30:00'),
        endTime: new Date('2025-05-24T10:55:00'),
        location: 'Auditorio Ingeniería',
        maxAttendees: null,
        tags: ['BizOps']
      },
      {
        title: 'Platform Engineer to Maximize Developer Skills',
        description: 'Juan Ricardo Gonzalez - STRP Architect REDHAT',
        speakers: [
          { name: 'Juan Ricardo Gonzalez', bio: 'STRP Architect REDHAT', photo: '' }
        ],
        startTime: new Date('2025-05-24T11:00:00'),
        endTime: new Date('2025-05-24T11:25:00'),
        location: 'Auditorio Principal',
        maxAttendees: null,
        tags: ['Platform Engineering', 'Developer Skills']
      },
      {
        title: 'Continuous Testing in the Cloud-Native World',
        description: 'Caio Medeiros - Senior Devops Architect TESTKUBE',
        speakers: [
          { name: 'Caio Medeiros', bio: 'Senior Devops Architect TESTKUBE', photo: '' }
        ],
        startTime: new Date('2025-05-24T11:00:00'),
        endTime: new Date('2025-05-24T11:25:00'),
        location: 'Sala 1 - Piso 2',
        maxAttendees: null,
        tags: ['Testing', 'Cloud-Native']
      },
      {
        title: 'Desarrollo Seguro con Checkmarx',
        description: 'Alejandro Enciso - Cybersecurity Advisory, Jorge Romero - CHECKMARX',
        speakers: [
          { name: 'Alejandro Enciso', bio: 'Cybersecurity Advisory', photo: '' },
          { name: 'Jorge Romero', bio: 'CHECKMARX', photo: '' }
        ],
        startTime: new Date('2025-05-24T11:30:00'),
        endTime: new Date('2025-05-24T11:55:00'),
        location: 'Sala 2 - Piso 2',
        maxAttendees: null,
        tags: ['Security', 'Checkmarx']
      },
      {
        title: 'DevOps Essentials Lab for Scrum Masters and PO',
        description: 'Christian Gomez - BBVA',
        speakers: [
          { name: 'Christian Gomez', bio: 'BBVA', photo: '' }
        ],
        startTime: new Date('2025-05-24T11:00:00'),
        endTime: new Date('2025-05-24T11:25:00'),
        location: 'Auditorio Ingeniería',
        maxAttendees: null,
        tags: ['DevOps', 'Scrum', 'PO']
      },
      {
        title: 'FINOPS',
        description: 'Cristian Soto - Rockwell Automation',
        speakers: [
          { name: 'Cristian Soto', bio: 'Rockwell Automation', photo: '' }
        ],
        startTime: new Date('2025-05-24T16:00:00'),
        endTime: new Date('2025-05-24T16:25:00'),
        location: 'Auditorio Ingeniería',
        maxAttendees: null,
        tags: ['FinOps']
      },
      {
        title: 'Cierre del Evento - Comité Organizador',
        description: '',
        speakers: [],
        startTime: new Date('2025-05-24T17:00:00'),
        endTime: new Date('2025-05-24T17:25:00'),
        location: 'Teatro Universitario',
        maxAttendees: null,
        tags: ['Cierre']
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

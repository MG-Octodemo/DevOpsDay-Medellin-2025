const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Create and initialize database
const db = new sqlite3.Database('database.sqlite');

async function initDatabase() {
  console.log('Initializing database...');

  // Create tables
  const createTables = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Talks table
    CREATE TABLE IF NOT EXISTS talks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      schedule TEXT NOT NULL,
      speaker TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Registrations table
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      talk_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (talk_id) REFERENCES talks (id),
      UNIQUE(user_id, talk_id)
    );
  `;

  // Execute table creation
  await new Promise((resolve, reject) => {
    db.exec(createTables, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Insert sample data
  console.log('Adding sample data...');

  // Sample users
  const users = [
    { name: 'Juan Pérez', email: 'juan@example.com', password: await bcrypt.hash('password123', 10) },
    { name: 'María García', email: 'maria@example.com', password: await bcrypt.hash('password123', 10) }
  ];

  // Sample talks
  const talks = [
    {
      title: 'Introducción a DevOps',
      description: 'Conceptos fundamentales de DevOps y su implementación en equipos de desarrollo.',
      schedule: '2025-03-15 09:00',
      speaker: 'Carlos Rodriguez'
    },
    {
      title: 'CI/CD con GitHub Actions',
      description: 'Aprende a implementar pipelines de integración y despliegue continuo.',
      schedule: '2025-03-15 10:30',
      speaker: 'Ana López'
    },
    {
      title: 'Containerización con Docker',
      description: 'Fundamentos de Docker y orquestación de contenedores.',
      schedule: '2025-03-15 14:00',
      speaker: 'Pedro Martínez'
    },
    {
      title: 'Monitoreo y Observabilidad',
      description: 'Herramientas y técnicas para monitorear aplicaciones en producción.',
      schedule: '2025-03-15 15:30',
      speaker: 'Laura Sánchez'
    }
  ];

  // Insert users
  for (const user of users) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)',
        [user.name, user.email, user.password],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Insert talks
  for (const talk of talks) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO talks (title, description, schedule, speaker) VALUES (?, ?, ?, ?)',
        [talk.title, talk.description, talk.schedule, talk.speaker],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  console.log('Database initialized successfully!');
  console.log('Sample users created:');
  console.log('- juan@example.com / password123');
  console.log('- maria@example.com / password123');
  
  db.close();
}

initDatabase().catch(console.error);
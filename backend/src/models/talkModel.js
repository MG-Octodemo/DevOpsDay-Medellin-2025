// In-memory database for talks
const talks = [
  {
    id: 1,
    titulo: "DevOps: Presente y Futuro",
    descripcion: "Charla sobre las tendencias actuales y futuras en DevOps",
    fecha: "2025-05-15",
    hora: "09:00",
    sala: "Auditorio Principal",
    ponente: "Ana Gómez"
  },
  {
    id: 2,
    titulo: "CI/CD con GitHub Actions",
    descripcion: "Workshop práctico sobre integración continua con GitHub Actions",
    fecha: "2025-05-15",
    hora: "11:00",
    sala: "Sala de Workshops",
    ponente: "Carlos Rodríguez"
  },
  {
    id: 3,
    titulo: "Kubernetes para principiantes",
    descripcion: "Introducción a Kubernetes y su ecosistema",
    fecha: "2025-05-15",
    hora: "14:00",
    sala: "Auditorio Principal",
    ponente: "María Pérez"
  },
  {
    id: 4,
    titulo: "Seguridad en el ciclo de DevOps",
    descripcion: "Como implementar DevSecOps en tu organización",
    fecha: "2025-05-16",
    hora: "09:00",
    sala: "Auditorio Principal",
    ponente: "Javier López"
  },
  {
    id: 5,
    titulo: "Automatización de infraestructura con Terraform",
    descripcion: "Aprende a gestionar tu infraestructura como código",
    fecha: "2025-05-16",
    hora: "11:00",
    sala: "Sala de Workshops",
    ponente: "Laura Martínez"
  },
  {
    id: 6,
    titulo: "Observabilidad en microservicios",
    descripcion: "Estrategias de monitoreo para arquitecturas distribuidas",
    fecha: "2025-05-16",
    hora: "14:00",
    sala: "Auditorio Principal",
    ponente: "Diego Sánchez"
  }
];

let nextTalkId = 7;

const getAllTalks = () => {
  return [...talks];
};

const getTalkById = (id) => {
  return talks.find(talk => talk.id === parseInt(id));
};

const addTalk = (talkData) => {
  const talk = {
    id: nextTalkId++,
    ...talkData
  };
  talks.push(talk);
  return talk;
};

module.exports = {
  getAllTalks,
  getTalkById,
  addTalk,
  talks
};
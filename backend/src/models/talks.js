// In-memory database for talks
const talks = [
  {
    id: 1,
    title: "DevOps en la Nube: Estrategias para Equipos Ágiles",
    speaker: "Carlos Ramírez",
    description: "Aprende las mejores prácticas de DevOps en entornos cloud y cómo implementarlas en tu equipo.",
    startTime: "09:00",
    endTime: "10:30",
    day: "2025-06-15",
    room: "Sala Principal"
  },
  {
    id: 2,
    title: "CI/CD con GitHub Actions",
    speaker: "Ana Martínez",
    description: "Implementación de pipelines de integración y despliegue continuo utilizando GitHub Actions.",
    startTime: "11:00",
    endTime: "12:30",
    day: "2025-06-15",
    room: "Sala Principal"
  },
  {
    id: 3,
    title: "Kubernetes para Principiantes",
    speaker: "Luis Gómez",
    description: "Introducción a Kubernetes y cómo puede mejorar la escalabilidad de tus aplicaciones.",
    startTime: "14:00",
    endTime: "15:30",
    day: "2025-06-15",
    room: "Sala Principal"
  },
  {
    id: 4,
    title: "Monitoreo Efectivo con Prometheus y Grafana",
    speaker: "Sara López",
    description: "Aprende a implementar soluciones de monitoreo para tus aplicaciones en producción.",
    startTime: "16:00",
    endTime: "17:30",
    day: "2025-06-15",
    room: "Sala Principal"
  },
  {
    id: 5,
    title: "DevSecOps: Integrando Seguridad en tu Pipeline",
    speaker: "Javier Torres",
    description: "Estrategias para incorporar seguridad en todas las etapas del ciclo de desarrollo.",
    startTime: "09:00",
    endTime: "10:30",
    day: "2025-06-16",
    room: "Sala Principal"
  },
  {
    id: 6,
    title: "Infraestructura como Código con Terraform",
    speaker: "Patricia Castillo",
    description: "Gestión eficiente de infraestructura utilizando Terraform para múltiples proveedores cloud.",
    startTime: "11:00",
    endTime: "12:30",
    day: "2025-06-16",
    room: "Sala Principal"
  },
  {
    id: 7,
    title: "Contenedores Docker en Producción",
    speaker: "Roberto Silva",
    description: "Mejores prácticas para la gestión de contenedores en entornos de producción.",
    startTime: "14:00",
    endTime: "15:30",
    day: "2025-06-16",
    room: "Sala Principal"
  },
  {
    id: 8,
    title: "Automatización con Ansible",
    speaker: "Elena Castro",
    description: "Simplificando la automatización de infraestructura con Ansible.",
    startTime: "16:00",
    endTime: "17:30",
    day: "2025-06-16",
    room: "Sala Principal"
  }
];

// Function to get all talks
const getAllTalks = () => {
  return talks;
};

// Function to get a talk by ID
const getTalkById = (id) => {
  return talks.find(talk => talk.id === parseInt(id));
};

module.exports = {
  getAllTalks,
  getTalkById
};

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS devopsdays;

-- Connect to the database
\c devopsdays;

-- Create tables
CREATE TABLE IF NOT EXISTS "Users" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Talks" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  speaker VARCHAR(255) NOT NULL,
  "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  room VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 50,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Registrations" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  "talkId" INTEGER REFERENCES "Talks"(id) ON DELETE CASCADE,
  "registrationDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "talkId")
);

-- Import sample data
INSERT INTO "Talks" (title, description, speaker, "startTime", "endTime", room, capacity) VALUES
(
  'Introducción a DevOps en la Era Cloud',
  'Esta charla introduce los principios fundamentales de DevOps y cómo se aplican en entornos cloud modernos. Aprenderás sobre las prácticas clave, herramientas esenciales y los beneficios de adoptar una cultura DevOps en tu organización.',
  'Ana Martínez',
  '2025-02-15 09:00:00-05',
  '2025-02-15 10:30:00-05',
  'Auditorio Principal',
  100
),
(
  'CI/CD Pipelines: De Cero a Héroe',
  'Aprende a construir pipelines de integración y despliegue continuo robustos utilizando herramientas modernas como GitHub Actions, Jenkins y ArgoCD. Esta sesión incluye demostraciones prácticas y patrones de diseño para diferentes escenarios.',
  'Carlos Restrepo',
  '2025-02-15 11:00:00-05',
  '2025-02-15 12:30:00-05',
  'Auditorio Principal',
  100
),
(
  'Observabilidad en Sistemas Distribuidos',
  'Explora técnicas avanzadas para implementar observabilidad efectiva en arquitecturas de microservicios. Cubriremos logging, métricas, tracing distribuido y cómo crear dashboards informativos para monitoreo proactivo.',
  'Laura González',
  '2025-02-15 14:00:00-05',
  '2025-02-15 15:30:00-05',
  'Auditorio Principal',
  100
),
(
  'GitOps: Infraestructura como Código en Acción',
  'Esta charla presenta los principios de GitOps y cómo aplicarlos para gestionar infraestructura y aplicaciones. Veremos herramientas como Flux y ArgoCD, y cómo implementar flujos de trabajo declarativos basados en Git.',
  'Daniel Ochoa',
  '2025-02-15 16:00:00-05',
  '2025-02-15 17:30:00-05',
  'Auditorio Principal',
  100
),
(
  'Containers 101: Docker y Kubernetes para Principiantes',
  'Introducción práctica a la containerización con Docker y orquestación con Kubernetes. Aprenderás los conceptos fundamentales, comandos básicos y cómo desplegar tus primeras aplicaciones en un cluster Kubernetes.',
  'María Pérez',
  '2025-02-16 09:00:00-05',
  '2025-02-16 10:30:00-05',
  'Auditorio Principal',
  100
),
(
  'DevSecOps: Seguridad en el Pipeline',
  'Aprende a integrar seguridad en cada etapa del ciclo de vida del desarrollo. Cubriremos análisis estático, escaneo de dependencias, tests de penetración automatizados y políticas de seguridad como código.',
  'Andrés Vélez',
  '2025-02-16 11:00:00-05',
  '2025-02-16 12:30:00-05',
  'Auditorio Principal',
  100
),
(
  'Infraestructura como Código con Terraform',
  'Explora las mejores prácticas para gestionar infraestructura como código utilizando Terraform. Aprenderás a definir recursos cloud en múltiples proveedores, gestionar estado, y organizar módulos reutilizables.',
  'Carolina Mejía',
  '2025-02-16 14:00:00-05',
  '2025-02-16 15:30:00-05',
  'Auditorio Principal',
  100
),
(
  'Chaos Engineering: Fortaleciendo Sistemas a través del Caos Controlado',
  'Introducción a los principios del Chaos Engineering y cómo implementarlo para mejorar la resiliencia de tus sistemas. Demostraremos herramientas como Chaos Monkey y Litmus para simular fallos en entornos controlados.',
  'Javier Ramírez',
  '2025-02-16 16:00:00-05',
  '2025-02-16 17:30:00-05',
  'Auditorio Principal',
  100
),
(
  'Workshop: Creando un Pipeline de CI/CD desde Cero',
  'Taller práctico donde implementaremos un pipeline completo de CI/CD para una aplicación web utilizando GitHub Actions. Cubriremos pruebas, construcción, análisis de seguridad y despliegue automatizado.',
  'Roberto Gómez',
  '2025-02-15 10:00:00-05',
  '2025-02-15 13:00:00-05',
  'Sala Workshop 1',
  30
),
(
  'Workshop: Kubernetes en Acción',
  'Taller hands-on donde desplegaremos una aplicación real en Kubernetes. Aprenderás a trabajar con Deployments, Services, ConfigMaps, Secrets, Ingress y cómo depurar problemas comunes.',
  'Sofía Torres',
  '2025-02-15 14:00:00-05',
  '2025-02-15 17:00:00-05',
  'Sala Workshop 1',
  30
),
(
  'Workshop: Monitorizando aplicaciones con Prometheus y Grafana',
  'En este taller práctico, configuraremos un sistema completo de monitorización utilizando Prometheus y Grafana. Aprenderás a definir métricas, consultas PromQL y crear dashboards efectivos.',
  'Martín López',
  '2025-02-16 10:00:00-05',
  '2025-02-16 13:00:00-05',
  'Sala Workshop 1',
  30
),
(
  'Workshop: Automatización con Ansible',
  'Aprende a utilizar Ansible para automatizar configuraciones e instalaciones en múltiples servidores. Crearemos playbooks, trabajaremos con inventarios y variables, y exploraremos roles reutilizables.',
  'Patricia Durán',
  '2025-02-16 14:00:00-05',
  '2025-02-16 17:00:00-05',
  'Sala Workshop 1',
  30
),
(
  'Apertura del evento: Bienvenida y Keynote',
  'Sesión de inauguración del DevOpsDays Medellín 2025 con un keynote sobre el estado actual y futuro de la cultura DevOps en Latinoamérica y tendencias emergentes en el ecosistema.',
  'Diego Lopera - Director DevOpsDays LATAM',
  '2025-02-15 08:15:00-05',
  '2025-02-15 08:45:00-05',
  'Auditorio Principal',
  200
),
(
  'Panel: Transformación Digital en Empresas Tradicionales',
  'Panel de discusión con líderes de la industria sobre cómo empresas tradicionales están adoptando prácticas DevOps para impulsar su transformación digital y los desafíos que enfrentan.',
  'Moderador: Isabel Restrepo, Panelistas: Jorge Ruiz (Bancolombia), Mariana Vélez (EPM), Fernando Gutiérrez (Grupo Nutresa)',
  '2025-02-15 13:00:00-05',
  '2025-02-15 13:45:00-05',
  'Auditorio Principal',
  100
),
(
  'Lightning Talk: Implementación de SRE en Startups',
  'Breve charla sobre cómo implementar prácticas de Site Reliability Engineering en startups con recursos limitados. Casos prácticos y lecciones aprendidas.',
  'Camilo Suárez',
  '2025-02-15 18:00:00-05',
  '2025-02-15 18:15:00-05',
  'Auditorio Principal',
  100
),
(
  'Lightning Talk: DevOps y Sostenibilidad',
  'Una mirada a cómo las prácticas DevOps pueden contribuir a reducir la huella de carbono de nuestras operaciones tecnológicas a través de la eficiencia y optimización.',
  'Valentina Torres',
  '2025-02-15 18:20:00-05',
  '2025-02-15 18:35:00-05',
  'Auditorio Principal',
  100
),
(
  'Networking Cocktail',
  'Sesión de networking para que los asistentes puedan intercambiar experiencias y hacer contactos profesionales en un ambiente distendido.',
  'Organización DevOpsDays',
  '2025-02-15 18:45:00-05',
  '2025-02-15 20:00:00-05',
  'Terraza Norte',
  150
),
(
  'MLOps: Machine Learning en producción',
  'Explora los desafíos y mejores prácticas para llevar modelos de Machine Learning a producción de manera escalable y mantenible. Cubriremos herramientas como MLflow, Kubeflow y técnicas para gestionar el ciclo de vida completo de ML.',
  'Alejandro Botero',
  '2025-02-16 09:00:00-05',
  '2025-02-16 10:30:00-05',
  'Sala Innovación',
  50
),
(
  'Plataforma como Servicio Interna: Construyendo tu propia PaaS',
  'Aprende cómo diseñar y construir una plataforma como servicio interna basada en Kubernetes para estandarizar y agilizar el desarrollo y despliegue en tu organización.',
  'Mauricio Carvajal',
  '2025-02-16 11:00:00-05',
  '2025-02-16 12:30:00-05',
  'Sala Innovación',
  50
),
(
  'FinOps: Optimizando Costos en la Nube',
  'Introducción a FinOps (Cloud Financial Operations) y cómo implementar una cultura de responsabilidad financiera en los equipos que utilizan recursos cloud, optimizando costos sin sacrificar rendimiento o innovación.',
  'Laura Valencia',
  '2025-02-16 14:00:00-05',
  '2025-02-16 15:30:00-05',
  'Sala Innovación',
  50
),
(
  'Workshop: API Gateway con Kong',
  'Taller práctico donde aprenderás a implementar Kong como API Gateway para gestionar, asegurar y monitorizar tus APIs. Configuraremos autenticación, rate limiting, transformaciones y más.',
  'Santiago Berrío',
  '2025-02-15 10:00:00-05',
  '2025-02-15 13:00:00-05',
  'Sala Workshop 2',
  30
),
(
  'Workshop: Seguridad en Contenedores',
  'Aprende técnicas y herramientas para asegurar imágenes Docker, configurar escaneo continuo de vulnerabilidades y establecer políticas de seguridad en entornos Kubernetes.',
  'Natalia Gómez',
  '2025-02-15 14:00:00-05',
  '2025-02-15 17:00:00-05',
  'Sala Workshop 2',
  30
),
(
  'Workshop: Gestión de Secretos con HashiCorp Vault',
  'Taller donde implementaremos HashiCorp Vault para gestionar de forma segura secretos, credenciales, tokens y certificados en entornos cloud y locales.',
  'Ricardo Álvarez',
  '2025-02-16 10:00:00-05',
  '2025-02-16 13:00:00-05',
  'Sala Workshop 2',
  30
),
(
  'Closing Keynote: El Futuro de DevOps y la Ingeniería de Plataforma',
  'Charla de cierre donde analizaremos las tendencias emergentes en DevOps, Ingeniería de Plataforma y cómo estas prácticas seguirán evolucionando en los próximos años.',
  'Luisa Fernández - CTO Globant Colombia',
  '2025-02-16 17:45:00-05',
  '2025-02-16 18:30:00-05',
  'Auditorio Principal',
  200
);
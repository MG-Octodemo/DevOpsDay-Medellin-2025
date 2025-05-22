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

-- Import agenda data from DevOpsDays Medellín 2025 v29
INSERT INTO "Talks" (title, description, speaker, "startTime", "endTime", room, capacity) VALUES
-- DÍA 1: MIÉRCOLES, 27 DE MAYO, 2025
(
  'Registro y acreditación',
  'Recepción de asistentes, entrega de credenciales y material del evento.',
  'Equipo de Organización DevOpsDays',
  '2025-05-27 07:30:00-05',
  '2025-05-27 08:30:00-05',
  'Hall Principal',
  350
),
(
  'Keynote de apertura: Estado del DevOps en 2025',
  'Análisis comprehensivo del panorama actual de DevOps, tendencias globales y su impacto en Latinoamérica, con enfoque en cómo las organizaciones están evolucionando en su madurez tecnológica.',
  'Dr. Nicole Forsgren - CEO DevOps Research and Assessment',
  '2025-05-27 08:30:00-05',
  '2025-05-27 09:30:00-05',
  'Auditorio Principal',
  350
),
(
  'Café y networking matutino',
  'Pausa para café, refrescos y oportunidad para hacer networking con otros asistentes y patrocinadores.',
  'Equipo de Organización DevOpsDays',
  '2025-05-27 09:30:00-05',
  '2025-05-27 10:00:00-05',
  'Área de Exhibición',
  350
),
(
  'Platform Engineering: Construyendo autopistas para desarrolladores',
  'Exploración de cómo la Ingeniería de Plataforma está transformando la forma en que los equipos construyen y entregan software, centrándose en la creación de plataformas internas que aumentan la productividad de los desarrolladores.',
  'Carlos Rojas - Lead Platform Engineer, Mercado Libre',
  '2025-05-27 10:00:00-05',
  '2025-05-27 10:45:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'GitOps: La evolución de la entrega continua',
  'Profundización en cómo GitOps está transformando los procesos de implementación, utilizando Git como fuente única de verdad para la infraestructura y las aplicaciones, con casos prácticos de ArgoCD y Flux.',
  'Ana Martínez - DevOps Lead, Globant',
  '2025-05-27 10:00:00-05',
  '2025-05-27 10:45:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Workshop: Kubernetes avanzado para entornos de producción',
  'Taller práctico sobre configuraciones avanzadas de Kubernetes en producción, incluyendo autoscaling, topologías multi-cluster, políticas de seguridad, gestión de recursos, y estrategias de recuperación ante desastres.',
  'Miguel Ángel Díaz - Kubernetes Solutions Architect, Red Hat',
  '2025-05-27 10:00:00-05',
  '2025-05-27 12:30:00-05',
  'Sala Workshop 1',
  40
),
(
  'Workshop: Automatización de seguridad en entornos cloud-native',
  'Taller hands-on donde implementaremos herramientas de seguridad automatizada para entornos cloud-native, incluyendo análisis de vulnerabilidades, configuración de políticas de seguridad como código y monitoreo de amenazas.',
  'Valentina Gutiérrez - Cloud Security Specialist, AWS',
  '2025-05-27 10:00:00-05',
  '2025-05-27 12:30:00-05',
  'Sala Workshop 2',
  40
),
(
  'AI Ops: Operaciones potenciadas por Inteligencia Artificial',
  'Análisis de cómo la IA está transformando las operaciones de TI, desde la detección predictiva de anomalías hasta la resolución automatizada de incidentes, con ejemplos prácticos de implementación.',
  'Dr. Andrés Moreno - AI/ML Lead, Microsoft',
  '2025-05-27 11:00:00-05',
  '2025-05-27 11:45:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'Observabilidad distribuida: Más allá de logs, métricas y trazas',
  'Una visión avanzada de observabilidad en sistemas distribuidos complejos, incluyendo técnicas de instrumentación, correlación de eventos, y cómo construir una cultura de observabilidad.',
  'Patricia Lagos - Staff SRE, Nubank',
  '2025-05-27 11:00:00-05',
  '2025-05-27 11:45:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Almuerzo y networking',
  'Pausa para almuerzo, bebidas y oportunidad para hacer networking con otros asistentes, ponentes y patrocinadores.',
  'Equipo de Organización DevOpsDays',
  '2025-05-27 12:00:00-05',
  '2025-05-27 13:30:00-05',
  'Área de Exhibición',
  350
),
(
  'Panel: Transformación cultural en organizaciones tradicionales',
  'Discusión con líderes de empresas que han transitado exitosamente hacia culturas DevOps, abordando resistencias al cambio, estructuras organizacionales, y estrategias de transformación cultural.',
  'Moderador: Santiago Pino (Accenture), Panelistas: Laura Cárdenas (Bancolombia), Fernando Mejía (EPM), Catalina Álvarez (Grupo Sura)',
  '2025-05-27 13:30:00-05',
  '2025-05-27 14:15:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'Del monolito a microservicios: Lecciones de una migración real',
  'Caso de estudio detallado de la migración de una aplicación monolítica a microservicios, incluyendo estrategias de strangler pattern, domain-driven design, y gestión de datos distribuidos.',
  'Javier Restrepo - VP Engineering, Rappi',
  '2025-05-27 13:30:00-05',
  '2025-05-27 14:15:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Ingeniería del Caos en la práctica: Fortaleciendo sistemas a través del caos controlado',
  'Implementación práctica de técnicas de Chaos Engineering para mejorar la resiliencia de sistemas distribuidos, con demostraciones de herramientas como Chaos Mesh, Litmus y Gremlin.',
  'Diego Salazar - Chaos Engineer, Netflix',
  '2025-05-27 14:30:00-05',
  '2025-05-27 15:15:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'DevSecOps: Seguridad como código de primera clase',
  'Estrategias para integrar seguridad en cada fase del ciclo de vida del desarrollo, incluyendo análisis estático y dinámico, gestión de secretos, y automatización de políticas de seguridad.',
  'Carolina López - CISO, Mercado Libre',
  '2025-05-27 14:30:00-05',
  '2025-05-27 15:15:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Café y networking vespertino',
  'Pausa para café, refrescos y oportunidad para continuar el networking con asistentes y patrocinadores.',
  'Equipo de Organización DevOpsDays',
  '2025-05-27 15:15:00-05',
  '2025-05-27 15:45:00-05',
  'Área de Exhibición',
  350
),
(
  'Open Spaces: Sesión 1',
  'Sesiones auto-organizadas donde los participantes proponen temas para discutir en grupos pequeños. Formato colaborativo característico de DevOpsDays.',
  'Facilitado por equipo DevOpsDays',
  '2025-05-27 15:45:00-05',
  '2025-05-27 16:30:00-05',
  'Salas Open Space',
  150
),
(
  'Lightning Talks: Innovación en 5 minutos',
  'Serie de presentaciones ultrarrápidas (5 minutos cada una) sobre ideas innovadoras, herramientas emergentes y experimentos en el ámbito DevOps.',
  'Diversos ponentes',
  '2025-05-27 16:45:00-05',
  '2025-05-27 17:30:00-05',
  'Auditorio Principal',
  350
),
(
  'Recepción de networking - Cóctel de bienvenida',
  'Evento social para networking con bebidas, aperitivos y música. Oportunidad para establecer conexiones profesionales en un ambiente relajado.',
  'Patrocinado por Microsoft Azure',
  '2025-05-27 18:00:00-05',
  '2025-05-27 20:00:00-05',
  'Terraza Panorámica',
  350
),

-- DÍA 2: JUEVES, 28 DE MAYO, 2025
(
  'Registro para nuevos asistentes',
  'Recepción de asistentes de segundo día, entrega de credenciales y material del evento.',
  'Equipo de Organización DevOpsDays',
  '2025-05-28 07:30:00-05',
  '2025-05-28 08:30:00-05',
  'Hall Principal',
  350
),
(
  'Keynote: El futuro del trabajo en tecnología',
  'Visión sobre cómo la automatización, la IA y las prácticas DevOps están transformando los roles en la industria tecnológica y qué habilidades serán críticas en los próximos años.',
  'Luisa Fernández - VP Engineering, GitHub',
  '2025-05-28 08:30:00-05',
  '2025-05-28 09:30:00-05',
  'Auditorio Principal',
  350
),
(
  'Café y networking matutino',
  'Pausa para café, refrescos y oportunidad para hacer networking con otros asistentes y patrocinadores.',
  'Equipo de Organización DevOpsDays',
  '2025-05-28 09:30:00-05',
  '2025-05-28 10:00:00-05',
  'Área de Exhibición',
  350
),
(
  'FinOps: Optimizando costos en la nube sin sacrificar velocidad',
  'Estrategias prácticas para implementar FinOps en organizaciones, balanceando costos, velocidad y calidad en entornos cloud, con herramientas y métricas para optimización continua.',
  'Roberto Castro - Director de FinOps, Banco Santander',
  '2025-05-28 10:00:00-05',
  '2025-05-28 10:45:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'Service Mesh en producción: Más allá de los tutoriales',
  'Experiencias reales implementando service mesh en entornos de producción a gran escala, incluyendo configuraciones avanzadas, estrategias de despliegue y lecciones aprendidas.',
  'Mariana Torres - Platform Lead, Thoughtworks',
  '2025-05-28 10:00:00-05',
  '2025-05-28 10:45:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Workshop: Observabilidad y monitoreo avanzado',
  'Taller práctico sobre implementación de observabilidad y monitoreo avanzado, incluyendo OpenTelemetry, visualización con Grafana, alertas inteligentes y SLOs (Service Level Objectives).',
  'Luis Montoya - Observability Engineer, Datadog',
  '2025-05-28 10:00:00-05',
  '2025-05-28 12:30:00-05',
  'Sala Workshop 1',
  40
),
(
  'Workshop: Infrastructure as Code con CDK y Pulumi',
  'Taller hands-on sobre Infrastructure as Code utilizando lenguajes de programación con AWS CDK y Pulumi, implementando patrones avanzados y mejores prácticas para entornos multi-nube.',
  'Natalia Sánchez - Cloud Architect, AWS',
  '2025-05-28 10:00:00-05',
  '2025-05-28 12:30:00-05',
  'Sala Workshop 2',
  40
),
(
  'MLOps: Llevando modelos de ML a producción',
  'Estrategias y plataformas para operacionalizar modelos de machine learning, gestionando el ciclo de vida completo desde experimentación hasta producción y monitoreo.',
  'Dr. Carlos Zapata - MLOps Lead, Meta',
  '2025-05-28 11:00:00-05',
  '2025-05-28 11:45:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'DevOps para aplicaciones serverless y edge computing',
  'Adaptación de prácticas DevOps para arquitecturas serverless y edge computing, incluyendo patrones de desarrollo, pruebas, despliegue y monitoreo en estos nuevos paradigmas.',
  'Sebastián Ramírez - Senior Cloud Architect, Google',
  '2025-05-28 11:00:00-05',
  '2025-05-28 11:45:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Almuerzo y networking',
  'Pausa para almuerzo, bebidas y oportunidad para hacer networking con otros asistentes, ponentes y patrocinadores.',
  'Equipo de Organización DevOpsDays',
  '2025-05-28 12:00:00-05',
  '2025-05-28 13:30:00-05',
  'Área de Exhibición',
  350
),
(
  'Internal Developer Platforms: Abordando la experiencia del desarrollador',
  'Cómo diseñar y construir plataformas internas que mejoren la productividad y experiencia de los desarrolladores, con enfoques en self-service, abstracción de complejidad y estandarización.',
  'Alicia Gómez - Developer Experience Lead, Spotify',
  '2025-05-28 13:30:00-05',
  '2025-05-28 14:15:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'Zero Trust en entornos cloud-native',
  'Implementación de arquitecturas Zero Trust en entornos cloud-native, incluyendo service mesh para seguridad, autenticación mutua TLS, y políticas de acceso granular.',
  'Marco Valencia - Security Architect, IBM',
  '2025-05-28 13:30:00-05',
  '2025-05-28 14:15:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Sostenibilidad en DevOps: Reduciendo la huella de carbono de la tecnología',
  'Estrategias para medir y reducir el impacto ambiental de nuestras operaciones tecnológicas a través de optimización de recursos, eficiencia energética y toma de decisiones conscientes.',
  'Elena Martínez - Green Computing Lead, Microsoft',
  '2025-05-28 14:30:00-05',
  '2025-05-28 15:15:00-05',
  'Auditorio Principal - Track Principal',
  200
),
(
  'Arquitecturas Event-Driven en la práctica',
  'Implementación y operación de sistemas basados en eventos, incluyendo patrones de diseño, plataformas de streaming, esquemas de evolución y estrategias de procesamiento.',
  'Ricardo Palma - Arquitecto Principal, MercadoPago',
  '2025-05-28 14:30:00-05',
  '2025-05-28 15:15:00-05',
  'Sala Innovación - Track Transformación',
  80
),
(
  'Café y networking vespertino',
  'Pausa para café, refrescos y oportunidad para continuar el networking con asistentes y patrocinadores.',
  'Equipo de Organización DevOpsDays',
  '2025-05-28 15:15:00-05',
  '2025-05-28 15:45:00-05',
  'Área de Exhibición',
  350
),
(
  'Open Spaces: Sesión 2',
  'Segunda ronda de sesiones auto-organizadas donde los participantes proponen temas para discutir en grupos pequeños.',
  'Facilitado por equipo DevOpsDays',
  '2025-05-28 15:45:00-05',
  '2025-05-28 16:30:00-05',
  'Salas Open Space',
  150
),
(
  'Panel: El futuro de DevOps en Latinoamérica',
  'Discusión sobre las tendencias y desafíos específicos del ecosistema tecnológico latinoamericano, oportunidades de crecimiento y cómo la región puede liderar en innovación DevOps.',
  'Moderador: Carlos Zuluaga (DevOpsDays Organizer), Panelistas: Gabriela Mora (AWS), Juan Pérez (GitHub), Andrea Vásquez (Google), Manuel Ortiz (Microsoft)',
  '2025-05-28 16:45:00-05',
  '2025-05-28 17:30:00-05',
  'Auditorio Principal',
  350
),
(
  'Keynote de clausura: DevOps como ventaja competitiva',
  'Charla de cierre sobre cómo la excelencia en prácticas DevOps puede convertirse en una ventaja competitiva decisiva para organizaciones de todos los tamaños, con un enfoque en medición e impacto en el negocio.',
  'Daniela Velásquez - CTO, Rappi',
  '2025-05-28 17:45:00-05',
  '2025-05-28 18:30:00-05',
  'Auditorio Principal',
  350
),
(
  'Ceremonia de clausura y agradecimientos',
  'Cierre oficial del evento, agradecimientos a patrocinadores, voluntarios y asistentes, y anuncio de próximas ediciones.',
  'Equipo Organizador DevOpsDays Medellín',
  '2025-05-28 18:30:00-05',
  '2025-05-28 19:00:00-05',
  'Auditorio Principal',
  350
),

-- DÍA 3: VIERNES, 29 DE MAYO, 2025 - DÍA DE WORKSHOPS
(
  'Registro para día de workshops',
  'Registro exclusivo para asistentes a los talleres del tercer día.',
  'Equipo de Organización DevOpsDays',
  '2025-05-29 08:00:00-05',
  '2025-05-29 09:00:00-05',
  'Hall Principal',
  200
),
(
  'Workshop Full Day: Kubernetes en Producción de Principio a Fin',
  'Taller intensivo que cubre todo el ciclo de vida de aplicaciones en Kubernetes: diseño, despliegue, escalado, monitoreo, depuración y recuperación ante desastres. Los participantes construirán un cluster completo con aplicaciones reales.',
  'Daniel Rincón - Kubernetes Specialist, Red Hat',
  '2025-05-29 09:00:00-05',
  '2025-05-29 17:00:00-05',
  'Sala Workshop 1',
  40
),
(
  'Workshop Full Day: DevSecOps Masterclass',
  'Taller avanzado sobre implementación completa de prácticas DevSecOps, incluyendo código seguro, análisis estático y dinámico, escaneo de contenedores, seguridad en infraestructura como código y respuesta a incidentes.',
  'Alejandra Vargas - Security Architect, Google',
  '2025-05-29 09:00:00-05',
  '2025-05-29 17:00:00-05',
  'Sala Workshop 2',
  40
),
(
  'Workshop: CI/CD con GitHub Actions y ArgoCD',
  'Implementación de un pipeline CI/CD moderno utilizando GitHub Actions para CI y ArgoCD para CD/GitOps, con enfoque en estrategias de prueba, promoción entre entornos y automatización de calidad.',
  'Fernando Ocampo - DevOps Engineer, GitHub',
  '2025-05-29 09:00:00-05',
  '2025-05-29 13:00:00-05',
  'Sala Workshop 3',
  40
),
(
  'Workshop: Arquitectura de Microservicios con Spring Boot y Kubernetes',
  'Desarrollo e implementación de una arquitectura de microservicios con Spring Boot, desplegada en Kubernetes, incluyendo patrones de comunicación, gestión de estado, configuración distribuida y resiliencia.',
  'Marina López - Java Champion, Pivotal',
  '2025-05-29 09:00:00-05',
  '2025-05-29 13:00:00-05',
  'Sala Workshop 4',
  40
),
(
  'Almuerzo para asistentes a workshops',
  'Almuerzo incluido para todos los participantes de los talleres.',
  'Equipo de Organización DevOpsDays',
  '2025-05-29 13:00:00-05',
  '2025-05-29 14:00:00-05',
  'Área de Exhibición',
  200
),
(
  'Workshop: Observabilidad moderna con OpenTelemetry',
  'Implementación de observabilidad moderna utilizando OpenTelemetry como estándar abierto para métricas, trazas y logs, integrando con múltiples backends de observabilidad.',
  'Jaime Cortés - Observability Advocate, Elastic',
  '2025-05-29 14:00:00-05',
  '2025-05-29 18:00:00-05',
  'Sala Workshop 3',
  40
),
(
  'Workshop: MLOps con Kubeflow y MLflow',
  'Taller práctico sobre implementación de MLOps utilizando Kubeflow y MLflow para gestionar el ciclo de vida completo de modelos de machine learning, desde experimentación hasta producción y monitoreo.',
  'Daniela Rivera - ML Engineer, Google',
  '2025-05-29 14:00:00-05',
  '2025-05-29 18:00:00-05',
  'Sala Workshop 4',
  40
);
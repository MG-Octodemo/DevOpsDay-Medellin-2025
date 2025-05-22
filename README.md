# DevOpsDay-Medellin-2025 - Aplicación de Calendario de Charlas

Aplicación web para gestionar el calendario de charlas de DevOpsDays Medellin 2025, permitiendo a los usuarios ver detalles de las charlas y registrarse para asistir.

## Características

- Visualización del calendario de charlas del evento
- Detalles de cada charla (título, descripción, ponente, horario, sala)
- Registro de usuarios para charlas específicas
- Interfaz web responsiva

## Estructura del Proyecto

- `backend/`: API RESTful desarrollada con Node.js/Express
- `frontend/`: Aplicación React para la interfaz de usuario
- `database/`: Esquema de base de datos y datos de muestra
- `docker-compose.yml`: Configuración para ejecutar todos los servicios

## Requisitos Previos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instalación y Ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/MG-Octodemo/DevOpsDay-Medellin-2025.git
   cd DevOpsDay-Medellin-2025
   ```

2. Iniciar los servicios con Docker Compose:
   ```bash
   docker-compose up
   ```

3. Acceder a la aplicación:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Desarrollo

### Backend

Para ejecutar el backend en modo desarrollo:

```bash
cd backend
npm install
npm run dev
```

### Frontend

Para ejecutar el frontend en modo desarrollo:

```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /api/talks`: Obtener lista de todas las charlas
- `GET /api/talks/:id`: Obtener detalles de una charla específica
- `POST /api/registrations`: Registrar un usuario para una charla
- `GET /api/registrations`: Obtener todos los registros
- `GET /api/registrations/:talkId`: Obtener registros para una charla específica

## Contribuir

1. Fork el repositorio
2. Crear una rama para la funcionalidad (`git checkout -b feature/amazing-feature`)
3. Commit los cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

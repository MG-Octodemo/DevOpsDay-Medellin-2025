# DevOpsDay-Medellin-2025

Aplicación para la gestión de charlas y registro de asistentes para DevOpsDay Medellín 2025.

## Características

- Visualización de calendario de charlas
- Registro y autenticación de usuarios
- Registro de usuarios a charlas
- Perfil de usuario con listado de charlas registradas

## Tecnologías

- **Frontend:** React.js con Bootstrap para la interfaz de usuario
- **Backend:** Node.js con Express para la API
- **Base de datos:** En memoria (sin servicios externos)
- **Autenticación:** JWT (JSON Web Tokens)

## Estructura del Proyecto

```
/
├── backend/           # Servidor Node.js + Express
│   ├── src/
│   │   ├── index.js   # Punto de entrada del servidor
│   │   ├── models/    # Modelos de datos en memoria
│   │   ├── routes/    # Rutas de la API
│   │   └── middleware/# Middleware (autenticación, etc.)
│
└── frontend/          # Aplicación React
    ├── public/        # Archivos estáticos
    └── src/
        ├── components/# Componentes React
        ├── context/   # Context API para gestión de estado
        └── App.js     # Componente principal
```

## Instalación y Ejecución

### Backend

```bash
cd backend
npm install
npm start
```

El servidor correrá en `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación correrá en `http://localhost:3000`.

## Flujo de Usuario

1. Registro o inicio de sesión
2. Exploración del calendario de charlas
3. Ver detalles de charlas y registrarse
4. Gestionar charlas registradas desde el perfil de usuario

## Datos de Ejemplo

La aplicación viene precargada con datos de charlas para DevOpsDay Medellín 2025.

---

Desarrollado para DevOpsDay Medellín 2025

# Backend - DevOpsDay Medellín 2025

API REST para la aplicación DevOpsDay Medellín 2025.

## Tecnologías Utilizadas

- Node.js
- Express
- JWT para autenticación
- Almacenamiento en memoria para datos

## Estructura del Proyecto

- `src/models`: Estructuras de datos en memoria para usuarios y charlas
- `src/routes`: Endpoints de la API
- `src/middleware`: Middleware de autenticación
- `src/app.js`: Aplicación principal

## Endpoints

### Autenticación

- `POST /api/auth/register`: Registro de usuario nuevo
- `POST /api/auth/login`: Inicio de sesión
- `GET /api/auth/user`: Obtener datos del usuario actual (protegido)

### Charlas

- `GET /api/talks`: Obtener todas las charlas
- `GET /api/talks/:id`: Obtener una charla específica
- `POST /api/talks/:id/register`: Registrarse a una charla (protegido)

### Perfil

- `GET /api/profile`: Obtener perfil del usuario con charlas registradas (protegido)

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

La API estará disponible en `http://localhost:5000`.

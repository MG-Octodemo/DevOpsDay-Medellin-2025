# Frontend - DevOpsDay Medellín 2025

Aplicación web para el evento DevOpsDay Medellín 2025.

## Tecnologías Utilizadas

- React
- React Router para navegación
- Bootstrap para estilos
- Axios para peticiones HTTP

## Estructura del Proyecto

- `public/`: Archivos estáticos
- `src/`: Código fuente
  - `components/`: Componentes reutilizables
  - `pages/`: Páginas principales
  - `services/`: Servicios para comunicación con la API

## Funcionalidades

- Visualización del calendario de charlas
- Registro e inicio de sesión de usuarios
- Registro para asistir a charlas
- Perfil de usuario con charlas registradas

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

## Flujo de Usuario

1. **Usuarios no autenticados**: Pueden ver el calendario de charlas, pero necesitan iniciar sesión para registrarse a charlas.
2. **Registro/Login**: Los usuarios pueden crear una cuenta o iniciar sesión con credenciales existentes.
3. **Registro a charlas**: Los usuarios autenticados pueden registrarse para asistir a charlas.
4. **Perfil**: Los usuarios pueden ver su perfil con la lista de charlas a las que se han registrado.

# DevOps Day Medellín 2025 - Sistema de Registro a Charlas

Una aplicación web para el registro de participantes a charlas del DevOps Day Medellín 2025.

## Características

- **Autenticación:** Basic Authentication para acceso seguro
- **Gestión de charlas:** Visualización de charlas disponibles
- **Registro a charlas:** Los usuarios pueden inscribirse a múltiples charlas
- **Perfil de usuario:** Vista de charlas registradas por usuario
- **API RESTful:** Backend completo con endpoints documentados

## Tecnologías

- **Backend:** Node.js + Express
- **Base de datos:** SQLite
- **Frontend:** HTML/CSS/JavaScript vanilla
- **Autenticación:** Basic Authentication con bcrypt
- **Pruebas:** Jest + Supertest

## Instalación y Configuración

### Requisitos Previos
- Node.js 14+ 
- npm

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/MG-Octodemo/DevOpsDay-Medellin-2025.git
cd DevOpsDay-Medellin-2025
```

2. Instalar dependencias:
```bash
npm install
```

3. Inicializar la base de datos:
```bash
npm run init-db
```

4. Iniciar el servidor:
```bash
npm start
```

5. Abrir en el navegador: http://localhost:3000

## Uso

### Usuarios de Prueba

- **Email:** juan@example.com | **Contraseña:** password123
- **Email:** maria@example.com | **Contraseña:** password123

### Funcionalidades

1. **Iniciar sesión** con las credenciales de prueba
2. **Ver charlas disponibles** en la pestaña principal
3. **Registrarse a charlas** haciendo clic en "Registrarse"
4. **Ver mis registros** en la pestaña "Mis Registros"
5. **Cancelar registros** desde cualquier vista

## API Endpoints

### Autenticación
Todos los endpoints (excepto `/api/health`) requieren Basic Authentication.

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/me` | Información del usuario autenticado |
| GET | `/api/talks` | Lista de todas las charlas |
| GET | `/api/my-registrations` | Charlas registradas del usuario |
| POST | `/api/talks/:id/register` | Registrarse a una charla |
| DELETE | `/api/talks/:id/register` | Cancelar registro a una charla |

### Ejemplos de Uso

```bash
# Obtener información del usuario
curl -u juan@example.com:password123 http://localhost:3000/api/me

# Listar todas las charlas
curl -u juan@example.com:password123 http://localhost:3000/api/talks

# Registrarse a una charla
curl -X POST -u juan@example.com:password123 http://localhost:3000/api/talks/1/register

# Ver mis registros
curl -u juan@example.com:password123 http://localhost:3000/api/my-registrations
```

## Desarrollo

### Comandos Disponibles

```bash
npm start          # Iniciar servidor de producción
npm run dev        # Iniciar servidor de desarrollo (con nodemon)
npm test           # Ejecutar pruebas
npm run init-db    # Reinicializar base de datos
```

### Estructura del Proyecto

```
├── server.js              # Servidor principal Express
├── package.json           # Dependencias y scripts
├── scripts/
│   └── init-db.js        # Script de inicialización de BD
├── public/
│   └── index.html        # Frontend de la aplicación
├── tests/
│   └── api.test.js       # Pruebas de la API
├── database.sqlite       # Base de datos SQLite (generada)
└── README.md             # Documentación
```

### Base de Datos

#### Esquema de Tablas

**users**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- password (TEXT, hashed)
- created_at (DATETIME)

**talks**
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- schedule (TEXT)
- speaker (TEXT)
- created_at (DATETIME)

**registrations**
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER, FK)
- talk_id (INTEGER, FK)
- created_at (DATETIME)
- UNIQUE(user_id, talk_id)

## Pruebas

El proyecto incluye pruebas automatizadas que cubren:

- Autenticación básica
- Endpoints de la API
- Registro y cancelación de charlas
- Manejo de errores

Ejecutar pruebas:
```bash
npm test
```

## Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Basic Authentication en todos los endpoints protegidos
- Validación de entrada y manejo de errores
- Restricciones de base de datos (UNIQUE constraints)

## Despliegue

Para despliegue en producción:

1. Configurar variables de entorno:
   - `PORT`: Puerto del servidor (default: 3000)

2. Configurar base de datos de producción (PostgreSQL/MySQL recomendado)

3. Configurar reverse proxy (nginx) para HTTPS

4. Implementar monitoreo y logging

## Contribución

1. Fork del repositorio
2. Crear rama para la feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## Licencia

MIT License - ver archivo LICENSE para detalles.

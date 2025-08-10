# DevOpsDay Medellin 2025 - Agenda & Registration Platform

A web application for viewing and registering for talks at DevOpsDay Medellin 2025.

## Features

- 📅 Calendar view of all conference talks
- 👤 User authentication (sign up, sign in, password reset)
- ✅ Register for talks and receive confirmation emails

## Project Structure

This is a full-stack application with separate frontend and backend:

- `client/`: React frontend application
- `server/`: Node.js backend API

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB (local or cloud instance)

## Setup and Running

### Environment Variables

Create a `.env` file in both the client and server directories based on the provided `.env.example` files.

### Frontend

```bash
cd client
npm install
npm start
```

The frontend will be available at http://localhost:3000

### Backend

```bash
cd server
npm install
npm start
```

The API will be available at http://localhost:5000

## Development

### Testing

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test

# Run tests with coverage
npm test -- --coverage

# Security audit
npm audit
```

### Backend API Documentation

The backend provides REST APIs for:

- **Authentication**: User registration, login, profile management
- **Talks**: View conference talks and agenda
- **Registration**: Register for talks, manage registrations

#### Key Security Features

- JWT-based authentication with environment-configured secrets
- Comprehensive input validation and sanitization
- Rate limiting (100 req/15min general, 5 req/15min auth)
- Security headers (CSRF, XSS, clickjacking protection)
- CORS configuration with environment-based origins
- Request payload size limits (10MB)

For detailed security information, see [server/SECURITY.md](server/SECURITY.md).

#### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required for production
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com

# Optional configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### API Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## License

MIT

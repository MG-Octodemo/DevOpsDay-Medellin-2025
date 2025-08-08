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
```

## License

MIT

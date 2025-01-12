# Property Building Management System (PBMS)

A multi-tenant building management system with topology management, task tracking, and operative assignments.

## Project Structure

Building-Management

├ client/ # React + TypeScript frontend

├ server/ # Apollo GraphQL server

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Server Setup

1. Navigate to the server directory:

```
cd server
```

2. Install dependencies:

```
npm install
```

3. Start the server:

```node index.mjs```

4. Install Client dependencies

```npm install```

4. Start the development server:

```npm run dev```

The client will run on:  `http://localhost:5173`

## Key Features

- Multi-tenant architecture with tenant isolation.
- Building topology management (Floors, Locations, Spots).
- Task management with priority levels, states, and assignments.
- Human and robot operative management.
- Real-time occupancy updates.

## API Authentication

All GraphQL queries/mutations (except `tenants`) require an `X-Tenant-ID` header for tenant isolation.

## Available Scripts

### Server

- `node index.mjs` - Start the Apollo GraphQL server

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technologies Used

### Backend

- Apollo Server
- GraphQL
- In-memory data store

### Frontend

- React 18
- TypeScript
- Apollo Client
- Material UI
- TailwindCSS
- React Router v7
- Vite

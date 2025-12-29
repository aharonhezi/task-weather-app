# Task Management Application

A full-stack task management application built with React, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- npm

## Setup

### 1. Start the Database

```bash
docker-compose -f docker-compose.db.yml up -d
```

This starts PostgreSQL on port `5432` with:
- Database: `todoapp`
- User: `todoapp`
- Password: `todoapp123` (or set `DB_PASSWORD` env var)

### 2. Configure Backend Environment

Create `backend/.env`:

```env
DATABASE_URL="postgresql://todoapp:todoapp123@localhost:5432/todoapp?schema=public"
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Required - for weather and geocoding features
WEATHER_API_KEY=your-weather-api-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

**Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection (matches docker-compose.db.yml settings)
- `PORT`: Backend server port (default: 5000)
- `JWT_SECRET`: Secret for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration (default: 7d)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `WEATHER_API_KEY`: Required - WeatherAPI.com key
- `GOOGLE_GENERATIVE_AI_API_KEY`: Required - Google AI key for city detection
- `DB_PASSWORD`: Optional - Database password (default: todoapp123)

### 3. Setup Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend runs at `http://localhost:5000`

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## Database Commands

```bash
# Stop database
docker-compose -f docker-compose.db.yml down

# Stop and remove data
docker-compose -f docker-compose.db.yml down -v

# View database (Prisma Studio)
cd backend && npm run prisma:studio
```

## Troubleshooting

- **Database connection issues**: Ensure Docker is running and container is up (`docker ps`)
- **Port in use**: Change `PORT` in `backend/.env` or modify frontend port in `vite.config.ts`
- **CORS errors**: Verify `FRONTEND_URL` matches your frontend URL

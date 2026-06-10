# TaskFlow — Task Management API

A full-stack task management application with JWT authentication and role-based access control, built as part of the Primetrade.ai Backend Intern assignment.

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, express-validator  
**Frontend:** React.js (Vite), Tailwind CSS v4  

## Project Structure

```
Primetrade.ai-Assignment/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handler logic
│   ├── middlewares/     # Auth, RBAC, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # JWT helper
│   ├── validators/      # Input validation rules
│   ├── .env.example     # Environment variable template
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # Auth context (React Context API)
    │   ├── pages/       # Login, Register, Dashboard
    │   └── services/    # API service layer
    └── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or a MongoDB Atlas URI)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your values
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies all `/api` requests to the backend.

### Environment Variables

Create a `.env` file in the `backend/` folder using `.env.example` as a template:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/primetrade_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## API Reference

Base URL: `http://localhost:5000/api/v1`

### Auth Endpoints

| Method | Endpoint            | Access  | Description              |
|--------|---------------------|---------|--------------------------|
| POST   | /auth/register      | Public  | Register a new user      |
| POST   | /auth/login         | Public  | Login and receive JWT    |
| GET    | /auth/me            | Private | Get current user profile |
| GET    | /auth/users         | Admin   | List all users           |

### Task Endpoints

| Method | Endpoint       | Access         | Description                                |
|--------|----------------|----------------|--------------------------------------------|
| POST   | /tasks         | Private        | Create a new task                          |
| GET    | /tasks         | Private        | Get tasks (admin: all, user: own)          |
| GET    | /tasks/:id     | Private        | Get task by ID                             |
| PUT    | /tasks/:id     | Private        | Update task (admin: any, user: own)        |
| DELETE | /tasks/:id     | Private        | Delete task (admin: any, user: own)        |

#### Query Parameters (GET /tasks)

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| page      | number | Page number (default: 1)             |
| limit     | number | Items per page (default: 10)         |
| status    | string | Filter by: pending, in-progress, completed |

### Request / Response Format

**Register**
```json
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret1",
  "role": "user"
}
```

**Login**
```json
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "secret1"
}
```

**Create Task** (requires `Authorization: Bearer <token>`)
```json
POST /api/v1/tasks
{
  "title": "Write unit tests",
  "description": "Cover all controller functions",
  "status": "pending"
}
```

All responses follow the shape:
```json
{
  "success": true | false,
  "message": "...",
  "data": { ... }
}
```

## Role-Based Access Control

| Action                  | User        | Admin       |
|-------------------------|-------------|-------------|
| Create task             | Own tasks   | Any         |
| Read tasks              | Own only    | All tasks   |
| Update task             | Own only    | Any         |
| Delete task             | Own only    | Any         |
| View all users          | No          | Yes         |

## Security Practices

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT stored client-side in `localStorage`, sent as `Authorization: Bearer <token>`
- `password` field uses `select: false` — never returned in queries
- Input validated with **express-validator** before hitting business logic
- Duplicate key and Mongoose validation errors handled centrally
- CORS configured with explicit allowed headers and methods

## Scalability Notes

I kept scalability in mind while building this, even though it's a small project right now.

**API versioning** — all routes are under `/api/v1`. If I need to make breaking changes later, I can introduce `/api/v2` without affecting anyone using the current version.

**Layered structure** — controllers, routes, models, and middleware are all separated. Adding a new feature (like comments or notifications) means creating new files, not touching existing ones. This keeps things clean as the project grows.

**Stateless auth** — since JWT tokens are self-contained, any number of server instances can verify them without sharing session state. This makes horizontal scaling (running multiple instances behind a load balancer) straightforward.

**DB indexes** — I added a compound index on `{ createdBy, status }` in the Task model since that's the most common query. The email field is also indexed for fast login lookups.

**Not microservices (yet)** — right now auth and tasks run in the same process and share one database. That's fine for this scale. But because they're already in separate route/controller/model files, splitting them into independent services later wouldn't be a big refactor — more of a natural next step.

**Redis / caching** — not implemented here, but the structure supports it. A caching middleware could sit in front of the task list endpoint without changing any controller code.

**Load balancing** — since there's no server-side session, you can run multiple instances behind Nginx or any cloud load balancer without sticky sessions.

## API Documentation

Import `postman_collection.json` (found at the project root) into Postman to get a ready-to-use collection with all endpoints, example request bodies, and a pre-configured `{{baseUrl}}` variable.

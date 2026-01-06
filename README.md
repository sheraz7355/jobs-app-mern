# Jobs App - MERN Stack (with SQLite)

A job board application built with Express.js, React, Node.js, and SQLite database.

## Features

- User authentication (Register/Login/Logout)
- Job listing with featured jobs
- Job creation (authenticated users only)
- Search functionality
- Tag-based filtering
- Employer profiles with logos

## Tech Stack

- **Backend**: Express.js, Node.js
- **Database**: SQLite (better-sqlite3)
- **Frontend**: React, React Router
- **Authentication**: JWT (JSON Web Tokens)

## Quick Start

### Option 1: Install Everything at Once

From the root directory:
```bash
npm run install-all
npm run init-db
```

Then in separate terminals:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npm run init-db
```

4. Create a `.env` file (optional, defaults are set):
```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
jobs-app-mern/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── db/             # Database setup
│   │   └── server.js       # Express server
│   ├── uploads/            # Uploaded files (logos)
│   └── database.sqlite     # SQLite database (created after init)
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   └── utils/          # Utilities (API client)
│   └── public/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout (requires auth)

### Jobs
- `GET /api/jobs` - Get all jobs (featured and regular)
- `POST /api/jobs` - Create a new job (requires auth)

### Search
- `GET /api/search?query=...` - Search jobs by title

### Tags
- `GET /api/tags/:name` - Get jobs by tag name

## Notes

- The database file (`database.sqlite`) will be created automatically when you run `npm run init-db`
- Uploaded logos are stored in `backend/uploads/logos/`
- JWT tokens are stored in localStorage on the frontend
- The app uses SQLite for fast, local development without needing MongoDB

# jobs-app-mern

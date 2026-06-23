# ProjectFlow — Project Management System

A full-stack Trello-inspired project management system built with **React**, **Node.js/Express**, and **SQLite** (or **MySQL**).

---

## 🚀 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, React Router, Recharts |
| Backend  | Node.js 24, Express 4             |
| Database | SQLite (default, zero-config) / MySQL |
| Auth     | JWT + bcrypt                      |

---

## 📁 Folder Structure

```
Project-Management-System/
├── backend/
│   ├── config/          # database.js, initDb.js, schema.sql
│   ├── controllers/     # authController, projectController, taskController
│   ├── middleware/      # authMiddleware.js (JWT)
│   ├── models/          # userModel, projectModel, taskModel
│   ├── routes/          # authRoutes, projectRoutes, taskRoutes
│   ├── .env             # Environment variables
│   └── server.js        # Express app entry point
└── frontend/
    └── src/
        ├── components/  # Sidebar, Topbar, Cards, Modals
        ├── context/     # AuthContext.jsx
        ├── pages/       # Dashboard, Projects, ProjectDetail, Login, Register
        └── services/    # api.js (Axios)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ (v24.x recommended)
- npm 9+
- MySQL (optional — SQLite is used by default)

### 1. Backend Setup

```bash
cd backend
npm install

# (Optional) Initialize the database manually
node config/initDb.js
```

### 2. Configure Environment Variables

Copy and edit `.env`:

```bash
copy .env.example .env
```

Default `.env` (SQLite, no setup required):
```env
PORT=5000
JWT_SECRET=your_secret_key_here
DB_TYPE=sqlite
SQLITE_FILE=./database.sqlite
CORS_ORIGIN=http://localhost:5173
```

To use **MySQL** instead, set:
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=project_management_db
```
Then run the schema: `mysql -u root -p < config/schema.sql`

### 3. Start the Backend

```bash
cd backend
npm run dev     # with auto-reload (nodemon)
# OR
npm start       # production mode
```
Backend runs on: **http://localhost:5000**

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| POST   | /api/auth/register | Register new user        |
| POST   | /api/auth/login    | Login and receive JWT    |
| GET    | /api/auth/me       | Get current user (auth)  |

### Dashboard
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | /api/dashboard | Get analytics stats   |

### Projects (all require Auth)
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| GET    | /api/projects      | List all projects   |
| POST   | /api/projects      | Create project      |
| GET    | /api/projects/:id  | Get single project  |
| PUT    | /api/projects/:id  | Update project      |
| DELETE | /api/projects/:id  | Delete project      |

### Tasks (all require Auth)
| Method | Endpoint                              | Description      |
|--------|---------------------------------------|------------------|
| GET    | /api/projects/:projectId/tasks        | List tasks       |
| POST   | /api/projects/:projectId/tasks        | Create task      |
| GET    | /api/projects/:projectId/tasks/:id    | Get single task  |
| PUT    | /api/projects/:projectId/tasks/:id    | Update task      |
| DELETE | /api/projects/:projectId/tasks/:id    | Delete task      |
| GET    | /api/tasks?search=&status=&priority=  | Global search    |

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT tokens with configurable expiry
- All project/task routes protected with JWT middleware
- Row-level security: users can only access their own data
- Helmet.js for HTTP security headers
- CORS restricted to frontend origin

---

## 🎨 Features

- 🏠 **Dashboard** — Analytics cards + Recharts visualizations
- 📁 **Projects** — Create, search, edit, delete projects with status tracking
- 📋 **Kanban Board** — Trello-style board with Pending / In Progress / Done columns
- 🔍 **Search & Filter** — Search projects/tasks, filter by status and priority
- 🔐 **Auth** — JWT-based login/register with session persistence
- 📱 **Responsive** — Works on desktop and mobile

---

## 🛠️ Development Scripts

```bash
# Backend
npm run dev      # Start with nodemon (hot reload)
npm start        # Start without hot reload
npm run init-db  # Re-initialize database tables

# Frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

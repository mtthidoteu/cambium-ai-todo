# Todo Application

Modern fullstack todo application built with React/TypeScript frontend and FastAPI/Python backend.

## Process + AI Usage

- Queried GPT-5 on React/Typescript + FastAPI Layout to understand best practices, asked to compare to my existing habit (Flask / HTMLX/JS). However, my understanding of web development meant that most concepts weren't too hard to grasp.
- Launched Lovable, entered simple description of to do app. Happy with design/layout.
- Added couple of subtle features to enhanced experience: progress bar, date information (in specific user friendly format), subtle animations.
- I exported project into `frontend/` and successfully ran it locally.
- Used Claude Code to implement backend API endpoints and database models in `backend/` to keep everything tidy, and link to Frontend.
- Ask Claude to review layout and best practices of `frontend/`, to split TodoApp.tsx as Lovable violated single responsibility principle.
- When developing with or without AI, I try and keep my code as organised and modular as possible, with a human readable structure. This is extremely important for me. I've also noticed AI, especially agentic, prefers reading a code structure such as this.
- Generated two tests:
- Added Pytest and Vitest for testing: The backend tests verify complete API workflows with real HTTP calls, while frontend tests focus on UI behaviour with mocked dependencies. This dual approach ensures both API reliability and component functionality while maintaining the organised, modular structure that makes the codebase readable for both humans and AI tools.
- Added lint and type checking: Added preferred ruff and ty (astral's latest tools) for linting and type checking to improve code quality and maintainability while using Biome for frontend 


## Decisions Made

- Packaged everything in multistage Docker Containers as I am highly familiar with it (used for both my homelab and projects I have distributed such as Wizarr)
- .Env file for easy configuration
- Generated Running steps for clean markdown
- Used Traefik as reverse proxy for SSL and routing to my server 
- Sqlite for development as easier and lighter (and realistically would be more than enough for such an app)
- PostGres in a Docker Container for production
- Modern Tools for Fast Development and clean and consistent code: Astral Tools (uv, ruff and ty) and Biome.
- Shadcn/ui components which are used by lovable + my familiarity with Tailwind  

## Trade-Offs / TODO

App is lacking user authentication, and advanced reminder features (date, location...)
For more complex app, a more detailed organisation of components might be necessary (category folders instead of single files)
TODO: Customise/Update existing tasks (backend API endpoints ready)
TODO: CI/CD pipeline using github actions (Could imagine automating testing before building an image and redeploying)
TY is in early development, probably not wise in production app

## Time Spent

Project was around 1.5hrs in total to complete with an additional 10 minutes to deploy to server for demo and roughly 20mins to put together documented steps into Readme.


## 🚀 Local Development

For local development without Docker:

### Frontend (React/TypeScript)
```bash
cd frontend
npm install           # Install dependencies
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run Biome linting
npm run lint:fix     # Run Biome linting with auto-fix
npm run format       # Format code with Biome
npm run preview      # Preview production build
```

### Backend (Python/FastAPI)
```bash
cd backend
uv sync --dev        # Install dependencies (uses uv package manager)
uv run uvicorn app.main:app --reload  # Start development server (http://localhost:8000)
uv run pytest       # Run tests
uv run ty check .          # Type checking with Astral's ty
uv run ruff format . # Code formatting
uv run ruff check .  # Linting
```

### Database Setup
The backend uses SQLite by default for development. Database file: `tasks.db`
For production, set `DATABASE_URL` environment variable:
```
export DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/tasks
```

## 🐳 Docker Deployment

The application provides a modern containerized setup with both development and production environments.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0+)

### Quick Start

#### Development Environment (SQLite)
```bash
# Start development environment
docker compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

#### Production Environment (PostgreSQL)
```bash
# First, copy and configure environment variables:
cp .env.prod.example .env.prod          # Copy example config
# Edit .env.prod with your production values

# Then start production services:
set -a && source .env.prod && set +a && docker compose -f docker-compose.prod.yml -f docker-compose.override.yml up -d

# Access the application
# Application: http://localhost
# API: http://localhost/api
```

### Architecture Overview

**Development Stack**: React + Vite + FastAPI + SQLite  
**Production Stack**: React + Nginx + FastAPI + PostgreSQL

```
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── backend/Dockerfile          # Multi-stage backend build
└── frontend/Dockerfile         # Multi-stage frontend build
```

### Available Commands

#### Development
```bash
docker compose up -d                    # Start development environment
docker compose down                     # Stop development environment
docker compose restart                  # Restart development environment
docker compose logs                     # View all logs
docker compose logs backend             # View backend logs only
docker compose exec backend bash       # Open shell in backend container
docker compose up -d --build           # Rebuild from scratch
```

#### Production
```bash
# First, copy and configure environment variables:
cp .env.prod.example .env.prod          # Copy example config
# Edit .env.prod with your production values

# Then start production services:
set -a && source .env.prod && set +a && docker compose -f docker-compose.prod.yml -f docker-compose.override.yml up -d
docker compose -f docker-compose.prod.yml down                     # Stop production environment
docker compose -f docker-compose.prod.yml logs                     # View all logs
docker compose -f docker-compose.prod.yml exec backend bash        # Open shell in backend container
docker compose -f docker-compose.prod.yml exec postgres psql -U todouser -d tasks  # Open PostgreSQL shell
```

### Environment Configuration

#### Development
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:8000 (FastAPI with hot reload)
- **Database**: SQLite file (`./backend/tasks.db`)

#### Production
- **Application**: http://localhost (Nginx reverse proxy)
- **Database**: PostgreSQL with persistent volume
- **Optimizations**: Multi-worker FastAPI, Nginx compression, production builds

## 🧪 Testing

```bash
make test
```

### Backend Tests
```bash
make test-backend
```

### Frontend Testing
```bash
make test-frontend
```

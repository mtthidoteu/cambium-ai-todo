# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a fullstack todo application with two main components:
- **Frontend**: React/TypeScript application using Vite, shadcn/ui, and Tailwind CSS
- **Backend**: FastAPI Python application with PostgreSQL database using SQLAlchemy

The frontend uses localStorage for persistence, while the backend provides a REST API for task management with PostgreSQL storage.

## Development Commands

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

## Architecture Overview

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React hooks with localStorage persistence
- **HTTP Client**: TanStack Query for API communication
- **Routing**: React Router v6
- **Main Component**: `TodoApp.tsx` - handles all todo logic and UI

### Backend Architecture
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy 2.0 (future=True)
- **Schema**: Single `Task` model with id, title, completed, created_at fields
- **API**: REST endpoints under `/api/v1/tasks/`
- **Testing**: pytest with httpx for async testing
- **Package Management**: uv (modern Python package manager)

### API Endpoints
```
GET    /api/v1/tasks/           # List all tasks
POST   /api/v1/tasks/           # Create new task
PUT    /api/v1/tasks/{task_id}  # Update task (completed/title)
DELETE /api/v1/tasks/{task_id}  # Delete task
```

## Key Implementation Details

### Frontend State Management
- Uses React hooks for state management
- localStorage provides persistence (frontend is self-contained)
- Date handling with `date-fns` for relative timestamps
- Progress tracking with animated progress bar
- Toast notifications using shadcn/ui toast components

### Backend Data Layer
- SQLAlchemy models defined inline in `api/tasks.py`
- Database session management with dependency injection
- Automatic table creation on startup
- Pydantic schemas for request/response validation

### Development Workflow
- Backend runs on port 8000 by default
- Frontend runs on port 5173 with CORS configured for backend
- Both applications can be developed independently
- Frontend currently uses localStorage, backend provides API for future integration

## Docker Deployment

The project includes containerized deployment with Docker Compose:

### Docker Setup
- **Development**: Uses `docker-compose.yml` with SQLite and hot reload
- **Production**: Uses `docker-compose.prod.yml` with PostgreSQL and Nginx
- **Multi-stage Builds**: Optimized Dockerfiles for both frontend and backend

### Docker Commands
```bash
# Development environment
docker compose up -d                    # Start with SQLite
docker compose down                     # Stop services
docker compose logs                     # View logs
docker compose exec backend bash       # Backend shell

# Production environment  
# First, copy and configure environment variables:
cp .env.prod.example .env.prod          # Copy example config
# Edit .env.prod with your production values

# Then start production services:
set -a && source .env.prod && set +a && docker compose -f docker-compose.prod.yml -f docker-compose.override.yml up -d
docker compose -f docker-compose.prod.yml down      # Stop services
docker compose -f docker-compose.prod.yml logs      # View logs
```

### Container Architecture
- **Frontend**: Multi-stage build (dev: Vite server, prod: Nginx static)
- **Backend**: Multi-stage build (dev: hot reload, prod: 4 workers)
- **Database**: SQLite file (dev) or PostgreSQL container (prod)
- **Networking**: Internal Docker network with exposed ports

## Testing

### Backend Tests
```bash
cd backend
uv run pytest                    # Run all tests
uv run pytest -v                # Verbose output
uv run pytest app/tests/test_tasks.py  # Run specific test file
```

Test coverage includes:
- Task creation and listing
- Error handling (404 responses)
- Async HTTP client testing with httpx

### Frontend Testing
No test framework configured yet. Uses TypeScript for compile-time validation.

## Technology Stack Summary

**Frontend:**
- React 18 + TypeScript + Vite
- shadcn/ui + Radix UI components
- Tailwind CSS + custom animations
- TanStack Query + React Router
- date-fns for date formatting

**Backend:**
- FastAPI + uvicorn
- SQLAlchemy 2.0 + SQLite (dev) / PostgreSQL (prod) + psycopg
- Pydantic for validation
- pytest + httpx for testing
- uv for package management

**Development Tools (Ultra-Modern Stack):**
- Biome (frontend linting/formatting) - Rust-based, 10x faster than ESLint
- ty (backend type checking) - Astral's next-gen type checker, Rust-based
- Ruff (backend linting/formatting) - Rust-based, ultra-fast Python tooling
- TypeScript 5.8+ (frontend type checking) - Latest with advanced features
- uv (Python package manager) - Rust-based, 100x faster than pip
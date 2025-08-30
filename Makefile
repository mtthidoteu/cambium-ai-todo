.PHONY: help dev test build clean install lint format check
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Cambium Interview Todo App$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Development commands
dev: ## Start both frontend and backend development servers
	@echo "$(BLUE)Starting development servers...$(NC)"
	@trap 'kill %1; kill %2' INT; \
	$(MAKE) dev-backend & \
	$(MAKE) dev-frontend & \
	wait

dev-frontend: ## Start frontend development server (port 5173)
	@echo "$(GREEN)Starting frontend dev server...$(NC)"
	@cd frontend && npm run dev

dev-backend: ## Start backend development server (port 8000)
	@echo "$(GREEN)Starting backend dev server...$(NC)"
	@cd backend && uv run uvicorn app.main:app --reload

# Testing commands
test: ## Run all tests (frontend + backend)
	@echo "$(BLUE)Running all tests...$(NC)"
	@$(MAKE) test-backend
	@$(MAKE) test-frontend

test-frontend: ## Run frontend tests
	@echo "$(GREEN)Running frontend tests...$(NC)"
	@cd frontend && npm run test -- --run

test-backend: ## Run backend tests
	@echo "$(GREEN)Running backend tests...$(NC)"
	@cd backend && uv run pytest -v

test-watch: ## Run tests in watch mode
	@echo "$(BLUE)Running tests in watch mode...$(NC)"
	@trap 'kill %1; kill %2' INT; \
	cd backend && uv run pytest --watch . & \
	cd frontend && npm run test & \
	wait

# Build commands
build: ## Build both frontend and backend for production
	@echo "$(BLUE)Building for production...$(NC)"
	@$(MAKE) build-frontend
	@$(MAKE) build-backend

build-frontend: ## Build frontend for production
	@echo "$(GREEN)Building frontend...$(NC)"
	@cd frontend && npm run build

build-backend: ## Build backend (verify dependencies)
	@echo "$(GREEN)Verifying backend build...$(NC)"
	@cd backend && uv sync

# Quality commands
lint: ## Run linters on both projects
	@echo "$(BLUE)Running linters...$(NC)"
	@$(MAKE) lint-frontend
	@$(MAKE) lint-backend

lint-frontend: ## Run frontend linter (Biome)
	@echo "$(GREEN)Linting frontend...$(NC)"
	@cd frontend && npm run lint

lint-backend: ## Run backend linter (Ruff)
	@echo "$(GREEN)Linting backend...$(NC)"
	@cd backend && uv run ruff check .

format: ## Format code in both projects
	@echo "$(BLUE)Formatting code...$(NC)"
	@$(MAKE) format-frontend
	@$(MAKE) format-backend

format-frontend: ## Format frontend code (Biome)
	@echo "$(GREEN)Formatting frontend...$(NC)"
	@cd frontend && npm run format

format-backend: ## Format backend code (Ruff)
	@echo "$(GREEN)Formatting backend...$(NC)"
	@cd backend && uv run ruff format .

check: ## Run type checking on both projects
	@echo "$(BLUE)Running type checks...$(NC)"
	@$(MAKE) check-frontend
	@$(MAKE) check-backend

check-frontend: ## Run TypeScript type checking
	@echo "$(GREEN)Type checking frontend...$(NC)"
	@cd frontend && npx tsc --noEmit

check-backend: ## Run Python type checking (ty)
	@echo "$(GREEN)Type checking backend...$(NC)"
	@cd backend && uv run ty check .

# Installation commands
install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@$(MAKE) install-frontend
	@$(MAKE) install-backend

install-frontend: ## Install frontend dependencies
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	@cd frontend && npm install

install-backend: ## Install backend dependencies
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	@cd backend && uv sync --dev

# Quality assurance
qa: ## Run complete quality assurance (lint + format + type-check + test)
	@echo "$(BLUE)Running complete QA pipeline...$(NC)"
	@$(MAKE) format
	@$(MAKE) lint
	@$(MAKE) check
	@$(MAKE) test
	@echo "$(GREEN)✅ QA pipeline completed successfully!$(NC)"

# Cleanup commands
clean: ## Clean build artifacts and dependencies
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@cd frontend && rm -rf node_modules dist .vite
	@cd backend && rm -rf .venv __pycache__ .pytest_cache build dist *.egg-info
	@echo "$(GREEN)Cleanup completed!$(NC)"

# Database commands
db-reset: ## Reset the database (SQLite)
	@echo "$(YELLOW)Resetting database...$(NC)"
	@cd backend && rm -f tasks.db
	@echo "$(GREEN)Database reset completed!$(NC)"

# Quick start
setup: ## Complete project setup (install + build + test)
	@echo "$(BLUE)Setting up project...$(NC)"
	@$(MAKE) install
	@$(MAKE) qa
	@echo "$(GREEN)✅ Project setup completed! Run 'make dev' to start development.$(NC)"
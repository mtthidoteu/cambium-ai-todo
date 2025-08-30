# Multi-stage build for React frontend
FROM node:20-alpine as base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM node:20-alpine as development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_API_BASE_URL
ARG NODE_ENV

# Set environment variables for the build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_ENV=$NODE_ENV

COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
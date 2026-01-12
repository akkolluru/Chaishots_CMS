# Chaishots CMS - Project Architecture Documentation

## Overview

Chaishots CMS is a comprehensive content management system designed to manage educational content in a hierarchical structure: Programs → Terms → Lessons. The system includes an admin CMS for content creators, a public catalog API for consumers, and a scheduled publishing mechanism.

## Project Structure

```
chaishots/
├── api/                    # Backend API server (NestJS)
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── routes/         # Route definitions (if using Express-style routing)
│   │   ├── services/       # Business logic and data processing
│   │   ├── models/         # Database models/entities
│   │   ├── middleware/     # Authentication, authorization, logging
│   │   ├── utils/          # Utility functions
│   │   └── workers/        # Background job processors
│   ├── package.json        # API dependencies and scripts
│   ├── tsconfig.json       # TypeScript configuration
│   └── Dockerfile          # Containerization for API
├── web/                    # Frontend application (Next.js)
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Shared libraries and utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── package.json        # Web dependencies and scripts
│   └── Dockerfile          # Containerization for web
├── shared/                 # Shared code between API and web
│   ├── types/              # Shared TypeScript interfaces
│   └── utils/              # Shared utility functions
├── docs/                   # Project documentation
├── docker-compose.yml      # Multi-container orchestration
└── package.json            # Root project configuration
```

## Detailed File Descriptions

### Root Directory

#### `package.json`
- **Purpose**: Root-level package configuration that orchestrates the entire monorepo
- **Function**: Contains scripts to run both API and web applications simultaneously, build processes, and dependency management
- **Key Scripts**:
  - `npm run dev`: Runs both API and web in development mode
  - `npm run build`: Builds both applications
  - `npm run docker:up`: Starts the full application stack with Docker

#### `docker-compose.yml`
- **Purpose**: Defines and runs multi-container Docker applications
- **Function**: Orchestrates PostgreSQL database, Redis cache, API server, web frontend, and background worker
- **Services**:
  - `db`: PostgreSQL database for persistent storage
  - `redis`: Redis cache for sessions and job queues
  - `api`: Backend API server
  - `web`: Frontend web application
  - `worker`: Background job processor for scheduled publishing

### API Directory (`api/`)

#### `api/package.json`
- **Purpose**: Defines dependencies and scripts specific to the backend API
- **Function**: Contains all necessary packages for the NestJS application including database ORM (Prisma), authentication (JWT), background jobs (BullMQ), and validation libraries
- **Key Dependencies**:
  - `@nestjs/*`: Core NestJS framework and modules
  - `@prisma/client`: Database ORM with type safety
  - `bullmq`: Background job processing
  - `@nestjs/jwt`: JSON Web Token authentication
  - `class-validator`: Request validation

#### `api/tsconfig.json`
- **Purpose**: TypeScript compiler configuration for the API
- **Function**: Configures TypeScript compilation settings including target ECMAScript version, module resolution, and type checking options
- **Key Settings**: Enables decorator metadata, experimental decorators, and proper module resolution for NestJS

#### `api/Dockerfile`
- **Purpose**: Instructions for building a Docker image of the API
- **Function**: Sets up the Node.js environment, installs dependencies, compiles TypeScript, and defines the startup command
- **Process**: Creates a production-ready container with optimized build steps

#### `api/src/main.ts`
- **Purpose**: Entry point of the NestJS application
- **Function**: Bootstraps the application, configures security (helmet), CORS, validation pipes, and starts the server
- **Key Features**: Security headers, cross-origin resource sharing, and request validation

### API Source Structure (`api/src/`)

#### `api/src/controllers/`
- **Purpose**: Handles incoming requests and returns responses
- **Function**: Contains route handlers that interact with services to process business logic
- **Responsibility**: Request validation, response formatting, and error handling

#### `api/src/services/`
- **Purpose**: Contains business logic and data processing
- **Function**: Implements core application features like CRUD operations, publishing workflows, and authentication
- **Responsibility**: Encapsulates complex logic separate from request/response handling

#### `api/src/models/`
- **Purpose**: Defines database entities and relationships
- **Function**: Maps to database tables with proper constraints, validations, and relationships
- **Responsibility**: Data structure definitions and database schema representation

#### `api/src/middleware/`
- **Purpose**: Handles cross-cutting concerns like authentication and logging
- **Function**: Intercepts requests to add functionality like user authentication, request logging, and rate limiting
- **Responsibility**: Security, logging, and request preprocessing

#### `api/src/utils/`
- **Purpose**: Contains utility functions used across the API
- **Function**: Provides helper functions for common operations like date formatting, string manipulation, etc.
- **Responsibility**: Reusable code that doesn't belong to specific business logic

#### `api/src/workers/`
- **Purpose**: Background job processors for scheduled tasks
- **Function**: Handles scheduled publishing of lessons and other asynchronous operations
- **Responsibility**: Ensuring scheduled content is published at the correct time with proper concurrency handling

### Web Directory (`web/`)

#### `web/package.json`
- **Purpose**: Defines dependencies and scripts for the frontend application
- **Function**: Contains Next.js framework, UI libraries, state management, and development tools
- **Key Dependencies**: Next.js, React, Tailwind CSS, and UI component libraries

#### `web/Dockerfile`
- **Purpose**: Instructions for building a Docker image of the web application
- **Function**: Sets up the Node.js environment, installs dependencies, builds the Next.js app, and defines the startup command
- **Process**: Creates a production-ready container with optimized build steps

#### `web/src/app/`
- **Purpose**: Next.js App Router pages and layouts
- **Function**: Defines the user interface routes and page structures
- **Responsibility**: UI rendering, routing, and page-specific logic

#### `web/src/components/`
- **Purpose**: Reusable UI components
- **Function**: Contains React components that can be used throughout the application
- **Responsibility**: Presentational elements and interactive components

#### `web/src/lib/`
- **Purpose**: Shared libraries and utilities for the frontend
- **Function**: Contains API clients, data fetching utilities, and other frontend-specific libraries
- **Responsibility**: Frontend-specific business logic and utilities

#### `web/src/types/`
- **Purpose**: TypeScript type definitions for the frontend
- **Function**: Defines TypeScript interfaces and types for frontend-specific data structures
- **Responsibility**: Type safety for frontend components and data

#### `web/src/utils/`
- **Purpose**: Utility functions for the frontend
- **Function**: Provides helper functions for common frontend operations
- **Responsibility**: Reusable frontend-specific code

### Shared Directory (`shared/`)

#### `shared/types/`
- **Purpose**: TypeScript interfaces shared between API and web
- **Function**: Defines common data structures used by both frontend and backend
- **Responsibility**: Ensuring type consistency across the application

#### `shared/utils/`
- **Purpose**: Utility functions shared between API and web
- **Function**: Contains common helper functions used by both applications
- **Responsibility**: Code reuse and consistency across frontend and backend

## Architecture Patterns

### Backend (NestJS)
- **Modular Architecture**: Organized in modules with clear separation of concerns
- **Dependency Injection**: Built-in DI container for managing dependencies
- **Middleware Pattern**: For cross-cutting concerns like authentication
- **Guard Pattern**: For authorization and access control

### Frontend (Next.js)
- **App Router**: Modern Next.js routing system
- **Component-Based**: Reusable UI components
- **Type Safety**: Strong typing throughout the application
- **API Integration**: Clean integration with backend API

### Database (PostgreSQL + Prisma)
- **ORM**: Prisma for type-safe database access
- **Migrations**: Version-controlled database schema changes
- **Relationships**: Properly defined foreign key relationships
- **Constraints**: Database-level validation and constraints

### Background Processing (BullMQ)
- **Job Queues**: Reliable background job processing
- **Concurrency Safety**: Proper handling of concurrent job execution
- **Idempotency**: Safe to run jobs multiple times without side effects
- **Monitoring**: Job status tracking and error handling

This architecture provides a scalable, maintainable, and production-ready foundation for the Chaishots CMS system.
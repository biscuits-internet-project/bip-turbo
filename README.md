# Bip Turbo

A modern monorepo application built with Turborepo, React Router, and TypeScript.

## Project Overview

This monorepo is structured using pnpm workspaces and Turborepo for efficient build orchestration. It consists of multiple applications and shared packages that work together to provide a complete solution.

### Apps

- **web**: A React application built with React Router v7, using modern UI components with Radix UI and Tailwind CSS. It serves as the main frontend interface for the application.
- **workers**: A TypeScript application that handles background processing using Temporal.io for workflow orchestration.

### Packages

- **@bip/domain**: Contains the core domain models and business logic, implemented with TypeScript and Zod for validation. This package defines the shared types and interfaces used across the application.
- **@bip/core**: Provides database access and core functionality, including Prisma ORM integration, Redis caching, and PostgreSQL database connectivity.

## Technology Stack

- **Frontend**: React, React Router v7, Tailwind CSS, Radix UI
- **Backend**: Node.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Background Processing**: Temporal.io
- **Build Tools**: Turborepo, pnpm, Vite
- **Code Quality**: Biome (linting and formatting), TypeScript
- **Deployment**: Fly.io (with blue-green deployment strategy)
- **Environment Management**: Doppler

## Getting Started

### Prerequisites

- Node.js 22 or later
- pnpm 10.5.2 or later
- Docker (for local development with PostgreSQL and Redis)

### Installation

1. Clone the repository
2. Install dependencies:

```sh
pnpm install
```

3. Set up environment variables using Doppler:

```sh
doppler setup
```

4. Generate Prisma client:

```sh
pnpm --filter @bip/core prisma:generate
```

### Development

Start the development server:

```sh
pnpm dev
```

This will start all applications and packages in development mode.

### Building

Build all applications and packages:

```sh
pnpm build
```

### Type Checking

Run type checking across all packages:

```sh
pnpm typecheck
```

### Linting

Run linting across all packages:

```sh
pnpm lint
```

### Formatting

Format code across all packages:

```sh
pnpm format
```

## Project Structure

```
bip-turbo/
├── apps/
│   ├── web/           # React frontend application
│   └── workers/       # Background processing workers
├── packages/
│   ├── core/          # Core functionality and database access
│   └── domain/        # Domain models and business logic
├── .github/           # GitHub Actions workflows
├── docker-compose.yaml # Local development services
└── turbo.json         # Turborepo configuration
```

## Deployment

The application is deployed to Fly.io using GitHub Actions with a blue-green deployment strategy. The deployment is triggered automatically when changes are pushed to the main branch, except for README updates.

## License

This project is licensed under the terms of the license included in the repository.

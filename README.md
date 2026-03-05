# VenHawk Backend Application

A NestJS backend API for the VenHawk vendor matching platform with Auth0 authentication and MySQL database.

## Features

- Auth0 JWT authentication
- MySQL database with TypeORM
- User synchronization
- Project submission with validation
- CORS enabled for React frontend

## Prerequisites

- Node.js (v20 or higher)
- MySQL (v8 or higher)
- Auth0 account

## Installation

```bash
npm install
```

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE venhawk;
```

2. Run the schema from `database/schema.sql` to create tables and seed data:
```bash
mysql -u root -p venhawk < database/schema.sql
```

This will create:
- `users` table
- `client_industries` table with seed data
- `project_categories` table with seed data
- `projects` table

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables in `.env`:

```env
# Server
PORT=3010
NODE_ENV=development

# Auth0
AUTH0_DOMAIN=dev-slqw3czm8ong7s3u.us.auth0.com
AUTH0_AUDIENCE=your-api-identifier

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=venhawk

# OpenAI (optional: tooltip reasoning for top 3 project matches)
OPENAI_API_KEY=your_openai_api_key
OPENAI_RECOMMENDATIONS_MODEL=gpt-4.1-mini
OPENAI_RECOMMENDATIONS_TIMEOUT_MS=10000
RECOMMENDATIONS_WARMUP_ON_CREATE=false
```

**Important**: Update `AUTH0_AUDIENCE` with your Auth0 API identifier.

## Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod

# Build
npm run build
```

The server will start on `http://localhost:3010`.

## API Endpoints

### 1. POST /api/users/sync

Sync Auth0 user data to local database (upsert operation).

**Authentication**: Required (Auth0 JWT Bearer token)

**Request Body**:
```json
{
  "sub": "auth0|123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://..."
}
```

**Response** (200 OK):
```json
{
  "id": "auth0|123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "created_at": "2025-01-24T10:00:00.000Z",
  "updated_at": "2025-01-24T10:00:00.000Z"
}
```

### 2. POST /api/projects

Create a new project submission.

**Authentication**: Required (Auth0 JWT Bearer token)

**Request Body**:
```json
{
  "clientIndustry": "technology",
  "projectTitle": "ServiceNow Implementation",
  "projectCategory": "itsm",
  "projectCategoryOther": null,
  "projectObjective": "We need to implement ServiceNow...",
  "businessRequirements": "Requirements are...",
  "technicalRequirements": "Technical specs...",
  "startDate": "2025-01-15",
  "endDate": "2025-06-30",
  "flexibleDates": true,
  "budgetType": "single",
  "totalBudget": "150000",
  "status": "submitted"
}
```

**Response** (201 Created):
```json
{
  "id": 123,
  "user_id": "auth0|123456789",
  "project_title": "ServiceNow Implementation",
  "client_industry_id": 5,
  "project_category_id": 9,
  "project_category_custom": null,
  "project_objective": "We need to...",
  "business_requirements": "Requirements are...",
  "technical_requirements": "Technical specs...",
  "start_date": "2025-01-15",
  "end_date": "2025-06-30",
  "flexible_dates": true,
  "budget_type": "single",
  "budget_amount": 150000.00,
  "budget_min": null,
  "budget_max": null,
  "budget_currency": "USD",
  "status": "submitted",
  "created_at": "2025-01-24T10:00:00.000Z",
  "updated_at": "2025-01-24T10:00:00.000Z",
  "submitted_at": "2025-01-24T10:00:00.000Z",
  "deleted_at": null
}
```

## Project Structure

```
src/
├── auth/
│   ├── auth.module.ts         # Auth module
│   ├── jwt.strategy.ts        # JWT strategy with Auth0
│   └── jwt-auth.guard.ts      # JWT authentication guard
├── users/
│   ├── entities/
│   │   └── user.entity.ts     # User entity
│   ├── dto/
│   │   └── sync-user.dto.ts   # User sync DTO
│   ├── users.controller.ts    # Users controller
│   ├── users.service.ts       # Users service
│   └── users.module.ts        # Users module
├── projects/
│   ├── entities/
│   │   ├── project.entity.ts           # Project entity
│   │   ├── client-industry.entity.ts   # Client industry entity
│   │   └── project-category.entity.ts  # Project category entity
│   ├── dto/
│   │   └── create-project.dto.ts       # Create project DTO
│   ├── projects.controller.ts          # Projects controller
│   ├── projects.service.ts             # Projects service
│   └── projects.module.ts              # Projects module
├── app.module.ts              # Root module with TypeORM config
└── main.ts                    # Application entry point with CORS

test/
└── app.e2e-spec.ts            # E2E tests
```

## Validation Rules

### Client Industry (clientIndustry)
- financial
- healthcare
- legal
- saas
- technology
- government

### Project Category (projectCategory)
- erp
- app-upgrades
- cloud-migration
- network
- security
- collaboration
- data-analytics
- disaster-recovery
- itsm
- endpoint
- database
- virtualization
- cloud-security
- other (requires `projectCategoryOther`)

### Budget Types
- **single**: Requires `totalBudget`
- **range**: Requires `minBudget` and `maxBudget` (maxBudget >= minBudget)

### Status
- draft
- submitted (automatically sets `submitted_at` timestamp)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## CORS Configuration

The API allows requests from:
- `http://localhost:5173` (React frontend)

## Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    "projectTitle must be between 1 and 500 characters"
  ]
}
```

## Common Error Codes

- **400 Bad Request**: Validation errors, missing fields
- **401 Unauthorized**: Missing or invalid Auth0 token
- **404 Not Found**: Invalid reference data (industry/category)
- **500 Internal Server Error**: Database or server errors

## Development Notes

- TypeORM synchronize is disabled
- TypeORM migrations in `src/database/migrations/*.ts` are auto-applied on `start:prod`
- Migration history is tracked in `typeorm_migrations`
- Legacy SQL files are archived in `database/legacy-sql-migrations/`
- A guard migration fails fast if base tables are missing/partial to prevent unsafe incremental runs
- A hardening migration repairs missing recommendation columns/indexes/foreign keys idempotently
- `npm run db:migrate:build` runs a full local build + migration cycle
- All dates are in YYYY-MM-DD format
- Budget values are stored as DECIMAL(15,2)
- Soft delete is implemented via `deleted_at` column
- User ID comes from Auth0 JWT token (sub claim)

## Migration Commands

- `npm run migration:show` - list pending/executed TypeORM migrations
- `npm run migration:run` - run pending TypeORM migrations (dev/CLI path)
- `npm run migration:revert` - revert the latest applied migration
- `npm run migration:create --name=add-new-column` - scaffold an empty migration file
- `npm run migration:generate --name=sync-schema` - generate migration from entity/schema diff
- If migration guard reports missing base tables, bootstrap once from `database/schema.sql`, then rerun migrations

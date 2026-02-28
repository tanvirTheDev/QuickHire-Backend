# QuickHire - Backend API

## Overview
QuickHire Backend is a REST API for managing job postings and job applications.
It provides endpoints to create, read, update, and soft-delete jobs, and to submit and track applications with validation, duplicate-prevention, and consistent error handling.

## Tech Stack
- Node.js (>=18)
- Express.js (`4.22.1`)
- TypeScript (`5.9.3`, strict mode)
- MongoDB + Mongoose (`9.2.3`)
- Zod (`4.3.6`)
- dotenv (`17.3.1`)
- cors (`2.8.6`)
- helmet (`8.1.0`)
- morgan (`1.10.1`)
- http-status-codes (`2.3.0`)
- express-async-errors (`3.1.1`)
- ts-node-dev (`2.0.0`)

## Project Structure
```text
backend/
├── src/                         # Application source code
│   ├── config/                  # Infrastructure/configuration setup
│   │   └── db.ts                # MongoDB connection bootstrap
│   ├── middlewares/             # Reusable Express middleware
│   │   ├── errorHandler.ts      # Global error handler
│   │   ├── notFound.ts          # 404 route handler
│   │   └── validateRequest.ts   # Zod request-body validator factory
│   ├── modules/                 # Feature-based module layers
│   │   ├── job/                 # Job domain (model/service/controller/route)
│   │   │   ├── job.interface.ts
│   │   │   ├── job.model.ts
│   │   │   ├── job.schema.ts
│   │   │   ├── job.service.ts
│   │   │   ├── job.controller.ts
│   │   │   └── job.route.ts
│   │   └── application/         # Application domain (model/service/controller/route)
│   │       ├── application.interface.ts
│   │       ├── application.model.ts
│   │       ├── application.schema.ts
│   │       ├── application.service.ts
│   │       ├── application.controller.ts
│   │       └── application.route.ts
│   ├── routes/                  # Root router composition
│   │   └── index.ts             # Mounts feature routers under /api
│   ├── types/                   # Shared/global type declarations
│   │   └── index.d.ts
│   ├── utils/                   # Shared utilities and helpers
│   │   ├── apiError.ts          # Operational custom error class
│   │   ├── apiResponse.ts       # Standardized API response formatter
│   │   └── catchAsync.ts        # Async controller wrapper
│   ├── app.ts                   # Express app setup, middleware, and routes
│   └── server.ts                # Server startup after DB connection
├── .env.example                 # Environment variable template
├── .gitignore                   # Ignored files/folders
├── package.json                 # Scripts and dependencies
├── tsconfig.json                # TypeScript compiler config
└── README.md                    # Project documentation
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally or a MongoDB Atlas connection URI

### Installation
```bash
# 1) Clone repository
git clone https://github.com/tanvirTheDev/QuickHire-Backend.git

# 2) Enter project
cd QuickHire-Backend

# 3) Install dependencies
npm install

# 4) Create environment file
cp .env.example .env

# 5) Update .env values
#    (especially MONGODB_URI and CLIENT_URL)

# 6) Run development server
npm run dev
```

### Environment Variables
| Variable | Description | Example |
| --- | --- | --- |
| `NODE_ENV` | Application environment | `development` |
| `PORT` | API server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/quickhire` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:3000` |

## API Reference

Base URL: `http://localhost:5000/api`

### Health Check
- **Method:** `GET`
- **Path:** `/health`
- **Description:** Verifies API is running.
- **Success Response Example:**
```json
{
  "success": true,
  "message": "QuickHire API is running",
  "environment": "development",
  "timestamp": "2026-02-28T18:12:00.000Z"
}
```

### Jobs

- **Method:** `POST`
- **Path:** `/jobs`
- **Description:** Create a new job posting.
- **Request Body:**
```json
{
  "title": "Backend Developer",
  "company": "QuickHire Inc",
  "location": "Dhaka",
  "category": "Engineering",
  "type": "Full-time",
  "salary": "1200 USD",
  "description": "We are looking for a backend developer with Node.js experience.",
  "requirements": "Node.js, Express, MongoDB"
}
```
- **Success Response Example:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Job created successfully",
  "data": {
    "_id": "67c1234567890abcdef1234",
    "title": "Backend Developer"
  }
}
```

- **Method:** `GET`
- **Path:** `/jobs`
- **Description:** Get paginated jobs with optional filters (`search`, `category`, `location`, `type`, `page`, `limit`).
- **Success Response Example:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

- **Method:** `GET`
- **Path:** `/jobs/:id`
- **Description:** Get a single active job by ID.
- **Success Response Example:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job retrieved successfully",
  "data": {
    "_id": "67c1234567890abcdef1234",
    "title": "Backend Developer"
  }
}
```

- **Method:** `PATCH`
- **Path:** `/jobs/:id`
- **Description:** Update a job by ID.
- **Request Body:** Any subset of job creation fields.
- **Success Response Example:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "_id": "67c1234567890abcdef1234",
    "title": "Senior Backend Developer"
  }
}
```

- **Method:** `DELETE`
- **Path:** `/jobs/:id`
- **Description:** Soft delete a job (`isActive = false`).
- **Success Response Example:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job deleted successfully"
}
```

### Applications

- **Method:** `POST`
- **Path:** `/applications`
- **Description:** Submit a new job application.
- **Request Body:**
```json
{
  "jobId": "67c1234567890abcdef1234",
  "name": "Tanvir Ahamed",
  "email": "tanvir@example.com",
  "resumeLink": "https://example.com/resume.pdf",
  "coverNote": "I am excited to apply for this role."
}
```
- **Success Response Example:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "67c9999999999abcdef9999",
    "status": "pending"
  }
}
```

- **Method:** `GET`
- **Path:** `/applications`
- **Description:** Get all applications with populated job summary (`title`, `company`, `location`).
- **Success Response Example:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Applications retrieved successfully",
  "data": []
}
```

- **Method:** `GET`
- **Path:** `/applications/:id`
- **Description:** Get a single application by ID.
- **Success Response Example:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Application retrieved successfully",
  "data": {
    "_id": "67c9999999999abcdef9999",
    "email": "tanvir@example.com"
  }
}
```

- **Method:** `GET`
- **Path:** `/applications/job/:jobId`
- **Description:** Get all applications for one job.
- **Success Response Example:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Applications for job retrieved successfully",
  "data": []
}
```

## Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

## Git Branch Strategy
- `feat/project-init`
- `feat/shared-utilities`
- `feat/job-module`
- `feat/application-module`
- `feat/final-polish`

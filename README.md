# Incident Tracker

A full-stack web application for managing production incidents with server-side pagination, filtering, and sorting capabilities.

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 (In-Memory Database)
- Maven

**Frontend:**
- React 18
- Vite
- React Router
- Axios

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm

## Setup Instructions

### Database

The application uses an in-memory H2 database for simplicity and ease of setup.

- No external database installation required
- Automatically initialized on startup
- Seeds 200 sample incidents if database is empty

H2 Console is available at:
http://localhost:8080/h2-console

JDBC URL:
jdbc:h2:mem:incident_tracker

Username:
SA

Password:
(empty)


### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` and automatically seed 200 incidents into the database on first run.

### Frontend Setup

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

The frontend will start on `http://localhost:3000`.

## API Overview

### Endpoints

**POST /api/incidents**
- Create a new incident
- Request body: `{ title, service, severity, status, owner?, summary? }`
- Returns: Created incident with ID and timestamps

**GET /api/incidents**
- Fetch paginated incidents with filtering and sorting
- Query parameters:
  - `page` (default: 0)
  - `size` (default: 10)
  - `sortBy` (default: createdAt)
  - `sortDir` (asc/desc, default: desc)
  - `search` (case-insensitive title search)
  - `severity` (SEV1/SEV2/SEV3/SEV4)
  - `status` (OPEN/MITIGATED/RESOLVED)
  - `service` (exact match)
- Returns: `{ content, page, size, totalElements, totalPages }`

**GET /api/incidents/{id}**
- Fetch a single incident by ID
- Returns: Incident details

**PATCH /api/incidents/{id}**
- Update incident fields (partial update)
- Request body: Any combination of `{ title, service, severity, status, owner, summary }`
- Returns: Updated incident

### Data Model

```
Incident {
  id: Long (auto-generated)
  title: String (required)
  service: String (required)
  severity: Enum (SEV1, SEV2, SEV3, SEV4) (required)
  status: Enum (OPEN, MITIGATED, RESOLVED) (required)
  owner: String (optional)
  summary: String (optional, max 2000 chars)
  createdAt: LocalDateTime (auto-generated)
  updatedAt: LocalDateTime (auto-updated)
}
```

## Design Decisions

### Backend

**JPA Specification for Dynamic Queries**
- Used Spring Data JPA Specification API for building dynamic queries with multiple optional filters
- Cleaner than writing custom JPQL queries and provides type safety
- Allows combining search, severity, status, and service filters flexibly

**Database Indexing**
- Added indexes on `severity`, `status`, and `created_at` columns
- These are the most frequently queried and sorted fields
- Improves query performance as dataset grows

**DTO Pattern**
- Separate request/response DTOs prevent exposing internal entity structure
- Allows API contract to evolve independently from database schema
- Request DTOs include validation annotations

**Global Exception Handler**
- Centralized error handling with `@RestControllerAdvice`
- Returns consistent error response format
- Handles validation errors, not found errors, and unexpected exceptions

**Data Seeding**
- CommandLineRunner seeds 200 realistic incidents on startup if database is empty
- Useful for development and testing
- Uses randomized data for variety

### Frontend

**Component Structure**
- Three main pages: IncidentList, IncidentDetail, CreateIncident
- Kept components focused on single responsibility
- No unnecessary abstraction layers

**Debounced Search**
- 300ms debounce on search input to avoid excessive API calls
- Resets to page 0 when search term changes
- Improves UX and reduces server load

**State Management**
- Used React hooks (useState, useEffect) without Redux
- State is localized to components that need it
- Simple enough for this application scope

**Loading and Error States**
- Explicit loading spinners during data fetch
- Error messages displayed prominently
- Disabled buttons during submission to prevent double-clicks

**Responsive Design**
- Clean, minimal CSS without external frameworks
- Mobile-friendly with media queries
- Focus on functionality over visual polish

## Tradeoffs

**What was prioritized:**
- Core functionality and correctness
- Clean, readable code structure
- Proper validation and error handling
- Server-side pagination and filtering
- Database performance with indexes

**What was simplified:**
- No authentication/authorization (would be required in production)
- Basic CSS styling (no design system)
- No comprehensive test coverage (would add unit and integration tests)
- No caching layer (Redis would help with read-heavy workloads)
- No audit logging (important for tracking incident changes)
- Single-field sorting only (could support multi-column sorting)

## Improvements with More Time

**Backend:**
- Add comprehensive unit and integration tests
- Implement authentication with JWT
- Add role-based access control (admin, engineer, viewer)
- Implement audit logging for all incident changes
- Add Redis caching for frequently accessed incidents
- Support bulk operations (bulk status updates)
- Add incident comments/timeline feature
- Implement webhooks for incident notifications
- Add metrics and monitoring (Prometheus/Grafana)
- Support file attachments for incidents

**Frontend:**
- Add comprehensive test coverage (Jest, React Testing Library)
- Implement optimistic UI updates
- Add real-time updates with WebSocket
- Improve accessibility (ARIA labels, keyboard navigation)
- Add data export functionality (CSV, PDF)
- Implement advanced filtering (date ranges, multiple services)
- Add incident analytics dashboard
- Support dark mode
- Add toast notifications for actions
- Implement infinite scroll as alternative to pagination

**Infrastructure:**
- Containerize with Docker
- Add CI/CD pipeline
- Set up proper logging aggregation
- Implement rate limiting
- Add API documentation with Swagger/OpenAPI
- Set up database migrations with Flyway/Liquibase
- Add health check endpoints
- Implement graceful shutdown

## Project Structure

```
.
├── backend/
│   ├── src/main/java/com/incidenttracker/
│   │   ├── config/          # Data seeding
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Request/response DTOs
│   │   ├── exception/       # Exception handling
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   └── package.json
└── README.md
```

## Notes

- The application uses CORS with `origins = "*"` for development. In production, this should be restricted to specific domains.
- Database credentials are in plain text in application.properties. Use environment variables or secrets management in production.
- The seeder creates 200 incidents with randomized data on first startup. Subsequent restarts will skip seeding if incidents already exist.

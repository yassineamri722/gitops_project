# TaskFlow Architecture

This repository is organized around an application-first three-tier structure. Deployment tooling is intentionally not added yet, so the project stays focused on the business application itself.

```text
Frontend        -> app/frontend/public
Backend         -> app/backend/src
Data access     -> app/backend/src/repositories + app/backend/db
```

## Layer responsibilities

### Frontend
- HTML, CSS, and JavaScript in `app/frontend/public`
- user interactions and API calls
- no direct database access

### Backend
- Express application in `app/backend/server.js`
- route definitions and request handling in `app/backend/src`
- validation and business logic in services and validators

### Data layer
- schema in `app/backend/db/schema.sql`
- repository-level SQL access in `app/backend/src/repositories`

## Flow

```text
Browser -> frontend -> API -> service -> validator -> repository -> SQLite
```

This keeps the app ready for later expansion into deployment automation, but keeps the code clean now.

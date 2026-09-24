# Application architecture

The project is intentionally organized as an application-only three-tier codebase. Deployment and automation files are not part of this structure.

```text
Presentation tier  ->  public/
Application tier   ->  server.js + src/routes/controllers/services
Data tier          ->  src/repositories + db/schema.sql
```

## Responsibilities

- `public/`: browser interface and API client.
- `src/routes/`: HTTP endpoint definitions.
- `src/controllers/`: request/response handling.
- `src/services/`: business rules and use cases.
- `src/validators/`: input validation independent from HTTP and SQL.
- `src/repositories/`: parameterized SQL queries and data mapping.
- `src/config/`: database connection lifecycle.
- `db/`: database schema and indexes.

## Request flow

```text
Browser -> Route -> Controller -> Service -> Validator -> Repository -> Database
```

The frontend never connects directly to PostgreSQL. The service layer validates input before the repository executes parameterized queries.

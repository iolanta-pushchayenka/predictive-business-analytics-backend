# API Documentation

## Overview

This directory contains the API documentation for the **Predictive Business Analytics Platform**, a web application designed to help small businesses analyze their data.

The backend is developed using Node.js and Express.js, with PostgreSQL for data storage and Sequelize ORM for database operations.

The API follows REST principles and is documented using the OpenAPI 3.1.0 specification.

## Interactive API Documentation

The API documentation is available through Swagger UI, which allows developers to explore endpoints, review request and response schemas, and execute HTTP requests.

**Local Swagger UI:**

http://localhost:3000/api-docs

**Deployed Swagger UI:**

https://predictive-business-analytics-backend.onrender.com/api-docs

_Note: The initial request may take longer if the Render service has been inactive, as the server needs time to start._

## Documentation Index

| Document                                               | Description                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| [OpenAPI Specification](openapi.yaml)                  | API endpoints, request and response schemas, authentication, and error codes               |
| [Getting Started](guides/getting-started.md)           | Installation, environment configuration, and local API setup                               |
| [Integration Tutorial](guides/integration-tutorial.md) | Step-by-step user registration, login, JWT authentication, and protected requests          |
| [Architecture Overview](architecture/api-overview.md)  | Backend architecture, request processing, and authentication sequence diagram              |
| [Authentication Guide](guides/authentication.md)       | JWT authentication, protected requests, security considerations, and authentication errors |
| [API Versioning Strategy](versioning.md)               | API version numbering, backward compatibility, and change management                       |
| [API Changelog](CHANGELOG.md)                          | History of API changes and upcoming functionality                                          |

## Available Endpoints

The currently implemented API provides the following operations:

| Method | Endpoint             | Description                               | Authentication |
| ------ | -------------------- | ----------------------------------------- | -------------- |
| GET    | `/api/health`        | Check API availability                    | Public         |
| POST   | `/api/auth/register` | Register a new user                       | Public         |
| POST   | `/api/auth/login`    | Authenticate a user                       | Public         |
| GET    | `/api/auth/me`       | Retrieve the authenticated user's profile | JWT required   |

The API uses JWT Bearer authentication for protected endpoints.

## API Validation

The OpenAPI specification is maintained in `docs/api/openapi.yaml`.

It can be validated using Redocly CLI from the backend project root:

```bash
npx @redocly/cli lint docs/api/openapi.yaml
```

Project-specific linting configuration is defined in `redocly.yaml` at the repository root.

## Documentation Maintenance

The API documentation is maintained alongside the backend source code.

Whenever an endpoint is introduced or modified:

1. Update the corresponding operation in `openapi.yaml`.
2. Document request parameters, responses, error codes, and authentication requirements.
3. Validate the specification using Redocly CLI.
4. Verify the endpoint's behavior through API testing.
5. Update relevant guides or architecture documentation when the changes affect existing workflows.

This approach helps keep the documentation consistent with the implemented API.

## Current Scope and Planned API Endpoints

The current API implementation provides user authentication and health monitoring. The platform is designed to support additional functionality for business data analysis and predictive analytics.

The following endpoints are planned for future development:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyses` | Upload a CSV dataset and perform server-side analysis, including EDA |
| GET | `/api/analyses` | Retrieve the authenticated user's analysis history |
| GET | `/api/analyses/:id` | Retrieve saved analysis results |
| POST | `/api/analyses/:id/forecast` | Generate a sales forecast |
| POST | `/api/analyses/:id/segmentation` | Perform customer segmentation |

**Note:** These endpoints are preliminary and have not yet been implemented. Their paths and request/response schemas may change during development. Only implemented endpoints are included in the current OpenAPI specification.

Client-side analysis is performed locally in the browser. Analysis history is planned exclusively for server-side processing.

## Documentation Strategy and Maintenance

The API documentation follows a **code-first documentation approach**: endpoints are implemented and tested in the Express backend, and their contracts are documented in the OpenAPI specification.

The following tools and standards are used:

- **OpenAPI 3.1.0** — defines endpoints, request and response schemas, authentication requirements, and error responses.
- **Swagger UI** — provides interactive documentation and allows developers to execute API requests.
- **Redocly CLI** — validates the OpenAPI specification and checks documentation quality.
- **Markdown** — provides developer guides, architecture descriptions, and integration instructions.
- **Mermaid** — visualizes API request flows and authentication processes.

### Naming and Versioning

API endpoints use the `/api` prefix and descriptive resource-based paths.

The documented API contract follows Semantic Versioning (`MAJOR.MINOR.PATCH`). Significant changes are recorded in [CHANGELOG.md](CHANGELOG.md), while versioning rules are described in [versioning.md](versioning.md).

### Documentation Maintenance

API documentation is maintained alongside the backend source code in the same Git repository.

Whenever an endpoint is added or modified, its OpenAPI definition is updated, validated using Redocly CLI, and checked against the implemented API behavior.

Related guides and architecture diagrams are updated when changes affect existing workflows or system architecture.

### Current Limitations

The OpenAPI specification covers the currently implemented endpoints only. Server-side analytics and analysis history endpoints will be documented as they are developed.

API validation and manual Swagger UI testing have been performed, but automated API contract testing and a dedicated documentation CI pipeline have not yet been implemented.

The API currently provides a single documented contract version and does not support multiple concurrently maintained API versions.

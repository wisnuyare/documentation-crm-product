# Tenant Service

The **Tenant Service** is the central authority for managing tenants, outlets, users, and core configurations. It acts as the master service for identifying clients and providing context to other services.

## Overview

This service handles the administrative backbone of the platform, ensuring multi-tenant isolation and centralized configuration management.

### Key Features

- **Tenant Management**: Full CRUD for tenants with custom branding.
- **Outlet Management**: Manage multiple WhatsApp outlets per tenant.
- **User Management**: Role-based access control (Admin, Agent, Viewer).
- **LLM Configuration**: Store tone, personality, and custom instructions.
- **Security**: Enforces Row-Level Security (RLS) in PostgreSQL.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | TypeScript | Node.js 22 |
| **Framework** | NestJS | Modular architecture |
| **Database** | PostgreSQL | With RLS enabled |
| **Auth** | Firebase | JWT validation |

## API Reference

### List Tenants
Retrieves all tenants.

- **Endpoint**: `GET /api/v1/tenants`

### Create Tenant
Creates a new tenant environment.

- **Endpoint**: `POST /api/v1/tenants`
- **Body**:
```json
{
  "name": "New Company",
  "slug": "new-company",
  "contact_email": "admin@newco.com"
}
```

### Update LLM Config
Configures the AI personality for the tenant.

- **Endpoint**: `PUT /api/v1/tenants/:id/llm-config`
- **Body**:
```json
{
  "tone": "friendly",
  "custom_instructions": "Use emojis.",
  "greeting_message": "Hi there! 👋"
}
```

### Create Outlet
Adds a WhatsApp line to a tenant.

- **Endpoint**: `POST /api/v1/outlets`
- **Body**:
```json
{
  "tenant_id": "uuid",
  "name": "Main Branch",
  "waba_phone_number": "+1234567890",
  "waba_access_token": "EAAG..."
}
```

# Billing Service

The **Billing Service** manages subscriptions, usage tracking, and quota enforcement. It ensures tenants stay within their plan limits and handles overage calculations.

## Overview

This service integrates closely with the Tenant Service to enforce resource limits based on subscription tiers (Starter, Growth, Enterprise).

### Key Features

- **Subscription Management**: Tier-based plans.
- **Usage Tracking**: Monitors messages, storage, and outlets.
- **Quota Enforcement**: Hard limits at 105% usage.
- **Deposit System**: Prepaid balance for overages.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | Go 1.21 | High performance |
| **Framework** | Gin | HTTP web framework |
| **Database** | PostgreSQL | Shared with Tenant Service |

## API Reference

### Get Subscription
Retrieves current plan details.

- **Endpoint**: `GET /api/v1/billing/tenants/:tenantId/subscription`

### Check Quota
Verifies if an action is allowed based on current usage.

- **Endpoint**: `POST /api/v1/billing/tenants/:tenantId/quota/check`
- **Body**:
```json
{
  "usageType": "messages",
  "count": 1
}
```
- **Response (Allowed)**:
```json
{
  "allowed": true,
  "percent": 90.0
}
```
- **Response (Blocked)**:
```json
{
  "allowed": false,
  "reason": "Quota exceeded (105% hard limit)"
}
```

### Record Usage
Increments usage counters.

- **Endpoint**: `POST /api/v1/billing/tenants/:tenantId/usage`
- **Body**:
```json
{
  "usageType": "messages",
  "count": 1
}
```

### Add Deposit
Adds funds for overage coverage.

- **Endpoint**: `POST /api/v1/billing/tenants/:tenantId/deposit`
- **Body**:
```json
{
  "amount": 100.00
}
```
tId/deposit`: Add funds.
- `GET /api/v1/billing/tenants/:tenantId/quota`: Check quota status.bscription Management**: Tracks tenant subscription status (SaaS model).

## Data Model

- **Invoice**: Record of a payment request.

# Booking Service

The **Booking Service** manages the reservation lifecycle for resources such as tables, courts, or rooms.

## Overview

It provides a specialized API for checking availability and managing time-slot based bookings.

### Key Features

- **Resource Management**: Define bookable items (e.g., "Court A").
- **Conflict Checking**: Prevents double-booking of time slots.
- **Tenant Isolation**: Scoped resources and bookings.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | Go 1.21 | High concurrency |
| **Framework** | Gin | HTTP web framework |
| **Database** | PostgreSQL | Relational storage |

## API Reference

### List Resources
Get all bookable items.

- **Endpoint**: `GET /api/v1/resources`

### Create Booking
Reserve a slot.

- **Endpoint**: `POST /api/v1/bookings`
- **Body**:
```json
{
  "resource_id": "uuid",
  "customer_name": "Budi",
  "booking_date": "2025-12-01",
  "start_time": "10:00",
  "end_time": "11:00"
}
```

### Check Availability
(Internal Logic) The service automatically checks for overlaps before confirming any booking.

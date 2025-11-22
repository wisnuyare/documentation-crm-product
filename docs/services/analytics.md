# Analytics Service

The **Analytics Service** aggregates data from conversations and system events to generate actionable insights and dashboards.

## Overview

It provides real-time metrics on conversation volume, response times, and resolution rates, optionally backed by BigQuery for scalable warehousing.

### Key Features

- **Dashboard Metrics**: Real-time stats for tenant dashboards.
- **BigQuery Integration**: Optional data warehousing.
- **Cost Tracking**: Monitor LLM and WhatsApp costs.
- **Performance Metrics**: Response times and handoff rates.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | Python 3.11 | Data processing |
| **Framework** | FastAPI | Async API |
| **Database** | PostgreSQL | Metadata |
| **Warehouse** | BigQuery | Large-scale analytics |

## API Reference

### Get Dashboard Metrics
Retrieves aggregated metrics for a date range.

- **Endpoint**: `GET /api/v1/metrics/dashboard`
- **Query Params**: `start_date`, `end_date`, `outlet_id`
- **Response**:
```json
{
  "conversations": [
    {
      "date": "2025-11-01",
      "total_conversations": 25,
      "resolution_rate": 0.72
    }
  ],
  "costs": [
    {
      "total_llm_cost": 0.008,
      "total_whatsapp_cost": 2.50
    }
  ]
}
```

### Get Tenant Summary
High-level performance summary.

- **Endpoint**: `GET /api/v1/metrics/summary`
- **Response**:
```json
{
  "total_conversations": 750,
  "average_response_time_seconds": 28.5,
  "total_cost": 75.50
}
```
age summary. for tenant owners.

## Integration

- **Data Source**: Consumes events from other services via message queue (RabbitMQ/Kafka).

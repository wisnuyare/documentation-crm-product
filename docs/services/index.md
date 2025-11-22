# Microservices Ecosystem

The **CRM Product** is composed of several specialized microservices that work together to provide a seamless experience.

## Core Services

- **[LLM Orchestration Service](./llm-orchestration)**: The brain of the system, routing intents and managing agents.
- **[Message Sender Service](./message-sender)**: Handles WhatsApp API integration and message delivery.
- **[Conversation Service](./conversation)**: Manages session history and context.

## Business Logic Services

- **[Booking Service](./booking)**: Manages resources, availability, and reservations.
- **[Order Service](./order)**: Handles product catalogs, orders, and inventory.
- **[Billing Service](./billing)**: Manages invoicing, payments, and subscriptions.

## Support Services

- **[Knowledge Service](./knowledge)**: RAG system for answering general queries.
- **[Analytics Service](./analytics)**: Tracks metrics and generates reports.
- **[Tenant Service](./tenant)**: Manages multi-tenancy configuration and onboarding.

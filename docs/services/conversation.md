# Conversation Service

The **Conversation Service** manages the lifecycle of customer interactions, including message history, real-time updates, and human handoff.

## Overview

This service is the hub for all chat activity, storing messages in PostgreSQL and broadcasting events via Socket.IO.

### Key Features

- **Message Storage**: Persistent history with PostgreSQL.
- **Real-time Updates**: Socket.IO for live agent dashboards.
- **Handoff Detection**: Auto-detects "speak to human" intent.
- **Context Management**: Provides recent message history to LLM.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | TypeScript | Node.js 22 |
| **Framework** | Express | REST API |
| **Real-time** | Socket.IO | WebSocket events |
| **Database** | PostgreSQL | Relational storage |

## API Reference

### Create Conversation
Initiates a new chat session.

- **Endpoint**: `POST /api/v1/conversations`
- **Body**:
```json
{
  "outlet_id": "uuid",
  "customer_phone": "+628123456789",
  "customer_name": "John Doe"
}
```

### Send Message
Stores a new message.

- **Endpoint**: `POST /api/v1/messages`
- **Body**:
```json
{
  "conversation_id": "uuid",
  "sender_type": "customer",
  "content": "I need help",
  "metadata": { "llm_model": "gpt-4o-mini" }
}
```

### Get Recent Messages
Retrieves context for the LLM.

- **Endpoint**: `GET /api/v1/conversations/:id/messages/recent?count=4`

### Request Handoff
Manually triggers a transfer to a human agent.

- **Endpoint**: `POST /api/v1/conversations/:id/handoff`
- **Body**:
```json
{
  "reason": "Customer requested human agent"
}
```

## WebSocket Events

- `conversation:new`: New conversation started.
- `conversation:message`: New message received.
- `conversation:handoff`: Handoff requested.
 history.
- `PUT /api/v1/conversations/:id/assign`: Assign agent to conversation.

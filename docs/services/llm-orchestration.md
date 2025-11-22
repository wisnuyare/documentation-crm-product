# LLM Orchestration Service

The **LLM Orchestration Service** is the central intelligence of the CRM Product. It receives user messages, determines the intent, and routes them to the appropriate specialized agent.

## Responsibilities

# LLM Orchestration Service

The **LLM Orchestration Service** is the brain of the platform. It assembles prompts, manages context, and interfaces with OpenAI to generate intelligent responses.

## Overview

It combines system prompts (tone/persona), conversation history, and RAG context to create a rich prompt for the LLM. It also handles token counting and cost tracking.

### Key Features

- **Prompt Assembly**: Combines Tone + History + RAG.
- **Streaming**: Server-Sent Events (SSE) for real-time typing.
- **Cost Tracking**: Calculates cost per request (Input/Output tokens).
- **Multi-Tone**: Supports Professional, Friendly, Emphatic, etc.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | Python 3.11 | Logic & Orchestration |
| **Framework** | FastAPI | Async API |
| **Model** | GPT-4o-mini | OpenAI API |
| **Tokenizer** | tiktoken | Accurate counting |

## API Reference

### Generate Response
Standard request-response generation.

- **Endpoint**: `POST /api/v1/llm/generate`
- **Body**:
```json
{
  "conversation_id": "uuid",
  "user_message": "What are your hours?",
  "knowledge_base_ids": ["uuid"],
  "stream": false
}
```
- **Response**:
```json
{
  "response": "We are open 9-5.",
  "tokens_used": { "total": 150 },
  "cost": { "total": 0.00005 }
}
```

### Stream Response
Real-time generation via SSE.

- **Endpoint**: `POST /api/v1/llm/stream`
- **Body**: Same as Generate
- **Response**: Server-Sent Events (`data: word`)

### Prompt Pipeline
1. **Fetch Context**: Parallel calls to Tenant (Tone), Conversation (History), and Knowledge (RAG) services.
2. **Assemble Prompt**: Construct system message and user context.
3. **Call LLM**: Send to OpenAI.
4. **Track Usage**: Log tokens and cost.

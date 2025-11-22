# Architecture Overview

The **CRM Product** is built on a robust Multi-Agent Architecture designed for scalability and intelligence.

## System Architecture (Flowchart)

This diagram illustrates how messages flow from the user through the API Gateway to the Orchestrator and specialized agents.

```mermaid
graph TD
    User["User (WhatsApp)"] -->|Message| API["API Gateway"]
    API -->|Route| Router["Orchestrator Router"]
    
    subgraph "Agent Swarm"
        Router -->|Intent: Booking| Booking["Booking Agent"]
        Router -->|Intent: Support| Support["Support Agent"]
        Router -->|Intent: Order| Order["Transaction Agent"]
    end
    
    Booking -->|Query| DB[("Database")]
    Order -->|Query| DB
    
    Booking -->|Response| Router
    Support -->|Response| Router
    Order -->|Response| Router
    
    Router -->|Final Response| API
    API -->|Reply| User
    
    style Router fill:#f9f,stroke:#333,stroke-width:2px
    style DB fill:#bbf,stroke:#333,stroke-width:2px
```

# Architecture Overview

The **CRM Product** is built on a robust Multi-Agent Architecture designed for scalability and intelligence.

## System Architecture

This diagram provides a high-level view of the **9 Microservices** that power the CRM Product, illustrating how they interact to deliver a seamless user experience.

```mermaid
graph TD
    User((User)) -->|WhatsApp| WA[WhatsApp Cloud API]
    WA -->|Webhook| MsgSender[Message Sender Service]
    MsgSender -->|HTTP| Gateway[API Gateway]
    
    subgraph "Core Platform"
        Gateway -->|Route| Orch[LLM Orchestration Service]
        
        subgraph "Support Services"
            Tenant[Tenant Service]
            Bill[Billing Service]
            Anal[Analytics Service]
        end
        
        subgraph "Context & Memory"
            Conv[Conversation Service]
            Know[Knowledge Service]
            Vector[(Qdrant)]
            Cache[(Redis)]
        end
        
        subgraph "Business Agents"
            Book[Booking Service]
            Order[Order Service]
        end
        
        Orch -->|Get Context| Conv
        Orch -->|RAG Search| Know
        Know --> Vector
        
        Orch -->|Intent: Booking| Book
        Orch -->|Intent: Order| Order
        Orch -->|Intent: Support| Know
        
        Book --> DB[(PostgreSQL)]
        Order --> DB
        Tenant --> DB
        Conv --> DB
        Bill --> DB
        Anal --> DB
    end
    
    style Orch fill:#f9f,stroke:#333,stroke-width:2px
    style DB fill:#bbf,stroke:#333,stroke-width:2px
    style Vector fill:#bbf,stroke:#333,stroke-width:2px
```

## Data Flow (Message Lifecycle)

The following sequence diagram explains exactly how a user's message is processed from the moment it is sent on WhatsApp until a response is delivered.

```mermaid
sequenceDiagram
    participant U as User
    participant WA as WhatsApp
    participant MS as Message Sender
    participant O as Orchestrator
    participant C as Conversation
    participant K as Knowledge
    participant A as Agent (Booking/Order)

    U->>WA: Send Message
    WA->>MS: Webhook (Message)
    MS->>O: Forward Message
    
    O->>C: Get Conversation History
    C-->>O: History Context
    
    O->>O: Classify Intent
    
    alt Intent: Booking/Order
        O->>A: Delegate Task
        A->>A: Process Logic
        A-->>O: Response
    else Intent: Question
        O->>K: RAG Search
        K-->>O: Relevant Docs
        O->>O: Generate Answer
    end
    
    O->>C: Save Interaction
    O->>MS: Send Response
    MS->>WA: API Call
    WA->>U: Deliver Message
```

## Database Schema (ERD)

The following Entity Relationship Diagram (ERD) represents the **complete and verified** data model of the CRM Product, derived directly from the database initialization and migration scripts.

```mermaid
erDiagram
    %% ==========================================
    %% CORE TENANT MANAGEMENT
    %% ==========================================
    TENANT ||--o{ OUTLET : owns
    TENANT ||--o{ USER : employs
    TENANT ||--o{ PRODUCT : catalogs
    TENANT ||--o{ CATEGORY : defines
    
    TENANT {
        uuid id PK
        string name
        string slug
        string status
        jsonb llm_tone
        string greeting_message
        string error_message
        string contact_email
        string firebase_tenant_id
    }
    
    OUTLET {
        uuid id PK
        uuid tenant_id FK
        string name
        string waba_phone_number
        string waba_phone_number_id
        string waba_business_account_id
        string status
    }
    
    USER {
        uuid id PK
        uuid tenant_id FK
        string firebase_uid
        string email
        string role
    }

    %% ==========================================
    %% BILLING & SUBSCRIPTIONS
    %% ==========================================
    TENANT ||--o{ SUBSCRIPTION : has
    TENANT ||--o{ USAGE_RECORD : tracks
    TENANT ||--o{ DEPOSIT : holds

    SUBSCRIPTION {
        uuid id PK
        uuid tenant_id FK
        string tier
        string status
        int message_quota
        int outlet_limit
        int knowledge_base_limit
        int storage_limit_mb
        decimal monthly_price
        decimal overage_rate
        timestamp started_at
        timestamp ended_at
    }

    USAGE_RECORD {
        uuid id PK
        uuid tenant_id FK
        string usage_type
        int count
        date period_start
        date period_end
    }

    DEPOSIT {
        uuid id PK
        uuid tenant_id FK
        decimal amount
        decimal balance
    }

    %% ==========================================
    %% CONVERSATION & MESSAGING
    %% ==========================================
    OUTLET ||--o{ CONVERSATION : handles
    CONVERSATION ||--o{ MESSAGE : contains
    USER ||--o{ CONVERSATION : "handed off to"

    CONVERSATION {
        uuid id PK
        uuid tenant_id FK
        uuid outlet_id FK
        string customer_phone
        string customer_name
        string status
        boolean handoff_requested
        uuid handoff_agent_id FK
        string handoff_reason
        timestamp last_message_at
    }

    MESSAGE {
        uuid id PK
        uuid conversation_id FK
        string sender_type
        string sender_id
        string content
        string whatsapp_message_id
        timestamp timestamp
        jsonb metadata
    }

    %% ==========================================
    %% KNOWLEDGE BASE (RAG)
    %% ==========================================
    OUTLET ||--o{ KNOWLEDGE_BASE : uses
    KNOWLEDGE_BASE ||--o{ DOCUMENT : contains

    KNOWLEDGE_BASE {
        uuid id PK
        uuid tenant_id FK
        uuid outlet_id FK
        string name
        string description
        string status
    }

    DOCUMENT {
        uuid id PK
        uuid knowledge_base_id FK
        uuid tenant_id FK
        string filename
        string file_type
        bigint file_size_bytes
        string storage_path
        string processing_status
        int chunk_count
    }

    %% ==========================================
    %% ORDER MANAGEMENT
    %% ==========================================
    TENANT ||--o{ ORDER : processes
    OUTLET ||--o{ ORDER : fulfills
    CONVERSATION ||--o{ ORDER : initiates
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "is in"
    CATEGORY ||--o{ PRODUCT : categorizes
    PRODUCT ||--o{ STOCK_ADJUSTMENT : "history of"

    CATEGORY {
        uuid id PK
        uuid tenant_id FK
        string name
        int display_order
    }

    PRODUCT {
        uuid id PK
        uuid tenant_id FK
        string name
        string description
        decimal price
        int stock_quantity
        int low_stock_threshold
        string category
        string sku
        string status
    }

    ORDER {
        uuid id PK
        uuid tenant_id FK
        uuid outlet_id FK
        uuid conversation_id FK
        string order_number
        string status
        decimal total
        string payment_status
        string fulfillment_type
        date pickup_delivery_date
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        string product_name
        decimal product_price
        int quantity
        decimal subtotal
    }

    STOCK_ADJUSTMENT {
        uuid id PK
        uuid tenant_id FK
        uuid product_id FK
        string adjustment_type
        int quantity_change
        int new_quantity
        uuid order_id FK
        uuid adjusted_by FK
    }

    %% ==========================================
    %% BOOKING SYSTEM
    %% ==========================================
    OUTLET ||--o{ RESOURCE : offers
    RESOURCE ||--o{ BOOKING : "booked via"
    CONVERSATION ||--o{ BOOKING : initiates

    RESOURCE {
        uuid id PK
        uuid tenant_id FK
        uuid outlet_id FK
        string name
        string type
        decimal hourly_rate
        string status
    }

    BOOKING {
        uuid id PK
        uuid tenant_id FK
        uuid outlet_id FK
        uuid resource_id FK
        uuid conversation_id FK
        string customer_phone
        date booking_date
        time start_time
        time end_time
        string status
        decimal total_price
    }
```

## Booking Sequence Diagram

A detailed look at the interaction between the User, Router, Booking Agent, and Database during a reservation.

```mermaid
sequenceDiagram
    participant U as User
    participant R as Router
    participant B as Booking Agent
    participant D as Database

    U->>R: "Book a table for 2 tomorrow"
    R->>B: Delegate (Intent: Booking)
    B->>B: Extract Entities (Date, Size)
    B->>D: Check Availability
    D-->>B: Slots Available
    B-->>R: Response: "Confirmed for 7 PM?"
    R-->>U: "Confirmed for 7 PM?"
    U->>R: "Yes"
    R->>B: Confirm Booking
    B->>D: Create Reservation
    D-->>B: Success
    B-->>R: Booking ID #123
    R-->>U: "Booked! ID: #123"
```

## Order State Diagram

The lifecycle of an order within the Transaction Agent.

```mermaid
stateDiagram-v2
    [*] --> Created
    Created --> PendingPayment: Checkout
    PendingPayment --> Paid: Payment Success
    PendingPayment --> Cancelled: Timeout/User Cancel
    Paid --> Processing: Kitchen Accepted
    Processing --> Ready: Preparation Done
    Ready --> Delivered: Driver Delivered
    Delivered --> [*]
    Cancelled --> [*]
```

## Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core** | **Hybrid** | Microservices architecture using Go, Python, and TypeScript |
| **Services (Go)** | Go 1.21 | High-performance services (Booking, Order, Billing, Message Sender) |
| **Services (Python)** | Python 3.11 | AI & Data services (LLM Orchestration, Knowledge, Analytics) |
| **Services (TS)** | Node.js / NestJS | Business logic services (Tenant, Conversation) |
| **Framework** | Fiber / FastAPI / NestJS | Optimized frameworks for each language |
| **LLM** | OpenAI GPT-4 | Intelligence engine |
| **Database** | PostgreSQL | Persistent storage |
| **Vector DB** | Qdrant | RAG knowledge base storage |
| **Cache** | Redis | Context and session caching |

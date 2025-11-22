# User Journey

This guide illustrates the typical flow for an end-user interacting with the CRM Product via WhatsApp.

## Flowchart

```mermaid
graph TD
    Start((Start)) --> Msg[User sends Message]
    Msg --> API[API Gateway]
    API --> Router{Orchestrator}
    
    Router -->|Booking Intent| Booking[Booking Agent]
    Router -->|Order Intent| Order[Transaction Agent]
    Router -->|Question| Knowledge[Knowledge Agent]
    
    Booking -->|Need Info| AskInfo[Ask for Date/Size]
    Booking -->|Confirmed| Booked[Create Reservation]
    
    Order -->|Browse| Catalog[Show Menu]
    Order -->|Checkout| Pay[Payment Link]
    
    Knowledge -->|Found| Answer[RAG Response]
    
    AskInfo --> Reply[Reply to User]
    Booked --> Reply
    Catalog --> Reply
    Pay --> Reply
    Answer --> Reply
    
    Reply --> End((End))
```

## Steps

1.  **Initiation**: User sends a message (e.g., "I want to book a table").
2.  **Routing**: The system identifies the intent as "Booking".
3.  **Interaction**: The Booking Agent asks for details (Date, Time, Party Size).
4.  **Fulfillment**: Once details are collected, the system checks availability and confirms the booking.
5.  **Notification**: User receives a confirmation message with a Booking ID.

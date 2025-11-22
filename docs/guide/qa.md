# QA Guide

This guide outlines the comprehensive testing procedures and checklists for the CRM Product. Use this to verify system stability before any release.

## Pre-Release Checklist

### Core System
- [ ] **Authentication**: Verify tenant API keys and WABA credentials load correctly.
- [ ] **Quota System**: Ensure message sending is blocked when quota is 0.
- [ ] **Latency**: Response time should be under 2 seconds for cached queries.

### AI & Orchestration
- [ ] **Intent Classification**: Verify correct routing for "Book a table" vs "Order food".
- [ ] **Context Retention**: Ensure the bot remembers user name and previous context across 5+ turns.
- [ ] **Hallucination Check**: Ask about non-existent products; bot should politely decline.

---

## Testing Scenarios

### 1. Booking Flow (Booking Agent)

**Goal**: Verify end-to-end booking creation.

1.  **User**: "I want to book a futsal court."
2.  **Bot**: "Sure! For which date and time?"
3.  **User**: "Tomorrow at 7 PM."
4.  **Bot**: "Checking availability... Court A is available. Should I book it?"
5.  **User**: "Yes, please."
6.  **Bot**: "Booking confirmed! Your Booking ID is #123."
    *   *Verification*: Check `bookings` table for new entry.

**Edge Cases**:
- [ ] **Double Booking**: Try to book the same slot again. Bot should say "Slot unavailable."
- [ ] **Past Date**: Try to book for "Yesterday". Bot should reject it.

### 2. Order Flow (Transaction Agent)

**Goal**: Verify product search and order placement.

1.  **User**: "Do you have chocolate cake?"
2.  **Bot**: "Yes! We have 'Chocolate Cake' (20cm) for Rp 150.000. Stock: 5."
3.  **User**: "I'll take 2."
4.  **Bot**: "Okay, 2 Chocolate Cakes. Total is Rp 300.000. Pickup or Delivery?"
5.  **User**: "Pickup."
6.  **Bot**: "Order created! Order #ORD-001. Please pay at the counter."
    *   *Verification*: Check `orders` table and verify `stock_quantity` reduced by 2.

**Edge Cases**:
- [ ] **Out of Stock**: Order more than available quantity. Bot should warn user.
- [ ] **Cancel Order**: "Cancel my order". Verify stock is restored.

### 3. Knowledge Base (RAG)

**Goal**: Verify answers from uploaded documents.

1.  **User**: "What is your refund policy?"
2.  **Bot**: (Retrieves answer from `policy.pdf`) "We offer full refunds within 24 hours of purchase."
3.  **User**: "What about cancellations?"
4.  **Bot**: "Cancellations must be made 2 hours in advance."

**Edge Cases**:
- [ ] **Irrelevant Question**: "Who is the president?" -> Bot: "I can only answer questions about [Business Name]."
- [ ] **Empty KB**: Ask question with no docs uploaded. Bot should handle gracefully.

### 4. Conversation Management

**Goal**: Verify session handling and handoff.

1.  **User**: "I need to speak to a human."
2.  **Bot**: "I will transfer you to an agent. Please wait."
    *   *Verification*: `handoff_requested` flag set to `true` in DB.
3.  **Agent**: (Sends message via dashboard) "Hi, how can I help?"
4.  **User**: "Thanks."

---

## Automated Testing Commands

Run these commands to validate services locally:

```bash
# Test Booking Service
curl http://localhost:3008/health

# Test Order Service
curl http://localhost:3009/health

# Test Message Sender
curl http://localhost:3006/health
```

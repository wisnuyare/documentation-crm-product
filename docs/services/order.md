# Order Service

The **Order Service** manages the e-commerce capabilities, including product catalog and order processing.

## Overview

It enables conversational commerce by allowing the LLM to search products and place orders on behalf of the user.

### Key Features

- **Product Catalog**: CRUD for products with stock tracking.
- **Order Management**: Lifecycle from creation to completion.
- **Inventory Control**: Auto-deduct stock on order.
- **LLM Functions**: Exposes tools for the AI to use.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | Go 1.21 | High performance |
| **Framework** | Gin | HTTP web framework |
| **Database** | PostgreSQL | Relational storage |

## API Reference

### List Products
Searchable product catalog.

- **Endpoint**: `GET /api/v1/products?search=cake`

### Create Order
Place a new order.

- **Endpoint**: `POST /api/v1/orders`
- **Body**:
```json
{
  "customer_phone": "+628123456789",
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "fulfillment_type": "pickup"
}
```

### Update Stock
Manually adjust inventory.

- **Endpoint**: `PUT /api/v1/products/:id/stock`
- **Body**:
```json
{
  "adjustment": -5,
  "reason": "Spoilage"
}
```

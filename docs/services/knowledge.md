# Knowledge Service

The **Knowledge Service** handles document management and RAG (Retrieval Augmented Generation) search. It processes uploaded files to create a searchable knowledge base.

## Overview

It parses PDFs, DOCX, and other formats, chunks the text, generates embeddings using OpenAI, and stores them in Qdrant for semantic search.

### Key Features

- **Document Processing**: PDF, DOCX, XLSX, TXT support.
- **Vector Search**: Qdrant integration for semantic retrieval.
- **Embeddings**: OpenAI `text-embedding-3-small`.
- **Chunking**: Intelligent text splitting with overlap.

## Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Language** | Python 3.11 | AI/ML processing |
| **Framework** | FastAPI | Async API |
| **Vector DB** | Qdrant | Similarity search |
| **Embeddings** | OpenAI | Vector generation |

## API Reference

### Create Knowledge Base
Creates a container for documents.

- **Endpoint**: `POST /api/v1/knowledge-bases`
- **Body**:
```json
{
  "name": "Product Manuals",
  "description": "Guides for all products"
}
```

### Upload Document
Uploads and processes a file.

- **Endpoint**: `POST /api/v1/knowledge-bases/:kbId/documents`
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file`

### Search (RAG)
Semantically searches across documents.

- **Endpoint**: `POST /api/v1/search`
- **Body**:
```json
{
  "query": "How do I reset my password?",
  "knowledge_base_ids": ["uuid"],
  "min_score": 0.7
}
```
- **Response**:
```json
[
  {
    "chunk_text": "To reset your password...",
    "score": 0.92,
    "document_filename": "guide.pdf"
  }
]
```
- `POST /api/v1/search`: Semantic search across documents.owledge Base Management**: CRUD operations for knowledge documents.

## Tech Stack

- **Vector Database**: Qdrant or Pinecone.

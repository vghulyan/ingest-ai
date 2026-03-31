# 🚀 Ingest AI

AI-powered document ingestion, semantic search, and RAG (Retrieval-Augmented Generation) system.

---

## 📖 Overview

This project allows you to:

- Upload documents (PDFs)
- Extract and process text
- Generate embeddings using OpenAI
- Perform semantic search (vector similarity)
- Ask questions grounded in your documents (RAG)
- Track processing via real-time event streaming (SSE)

---

## ⚙️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript
- **Backend**: NestJS
- **Database**: PostgreSQL (Prisma)
- **Storage**: MinIO (S3-compatible)
- **AI**: OpenAI (Embeddings + RAG)
- **Monorepo**: pnpm workspaces

---

## 🧰 Prerequisites

Make sure you have:

- Node.js ≥ 18
- pnpm
- PostgreSQL running
- MinIO running (port `9000`)
- OpenAI API key

---

## 🔑 Environment Setup

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ingest_ai
OPENAI_API_KEY=your_openai_api_key

PORT=7111

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:7111/api
```

## 📦 Install Dependencies
```
pnpm install
```

## 🧱 Database Setup
```
pnpm prisma generate
pnpm prisma migrate dev
```

## ▶️ Run the Application
```
pnpm dev
```


This will start:

Service	URL
API	http://localhost:7111/api

Web	http://localhost:7110

Worker	Background processing

## 📤 Usage Flow
1. Open the dashboard (`/dashboard`)
2. Upload a PDF document
3. Watch processing events in real-time
4. Run semantic search queries
5. Ask questions using RAG

## ⚠️ Common Issues

### ❌ 429 — Quota exceeded
- Your OpenAI quota is exhausted  
- Check billing: https://platform.openai.com/account/billing  

### ❌ MinIO connection errors
- Ensure MinIO is running on `localhost:9000`  
- Default credentials:


### ###

### ❌ Database issues
- Check `DATABASE_URL`  
- Run migrations again  

## 🧠 Architecture Notes
- Embeddings stored per document chunk  
- Cosine similarity used for ranking  
- RAG combines top-k chunks with LLM  
- SSE used for real-time ingestion updates  

## 📁 Project Structure (simplified)
- apps/
- api/ # NestJS backend
- web/ # Next.js frontend
- worker/ # Background processing
- packages/
- shared/ # Shared types & DTOs


## 📄 License
MIT
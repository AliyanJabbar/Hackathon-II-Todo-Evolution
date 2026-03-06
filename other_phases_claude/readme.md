# 🐳 Docker Environment & Networking Issues that I faced

During containerizing the application with Docker Compose, a few common issues related to environment variables and container networking were encountered. Below are the problems and their solutions.

## 1️⃣ Environment Variables Not Found in Docker Compose

### ❌ Problem

Initially, environment variables were placed in separate files:
- `frontend/.env.local`
- `backend/.env`

However, Docker Compose does not automatically load env files from subdirectories. It only automatically reads the `.env` file located in the same directory as `docker-compose.yml`.

Because of this:
- Services could not access required environment variables
- Builds failed
- Runtime variables were missing

### ✅ Solution

All environment variables were moved into a single `.env` file at the root of the project, alongside `docker-compose.yml`.

```text
project-root/
│
├── docker-compose.yml
├── .env
│
├── frontend/
│   └── Dockerfile
│
└── backend/
    └── Dockerfile
```

Docker Compose services now explicitly load this file:

```yaml
services:
  backend:
    env_file:
      - ./.env

  frontend:
    env_file:
      - ./.env

  mcp:
    env_file:
      - ./.env
```

This ensures all services share the same environment configuration.

---

## 2️⃣ Container Networking vs Browser URLs

### ❌ Problem

Containers communicate using Docker's internal network, but browsers access services through `localhost`.

This caused connection failures when frontend requests were made to container hostnames like:
`http://backend:8000`

Browsers cannot resolve Docker service names.

### ✅ Solution

Two types of URLs are used depending on where the request originates.

#### 🌐 Browser → Container

When the browser accesses a service, it must use `localhost` with the exposed port.

**Example:**
- `http://localhost:3000` → Frontend
- `http://localhost:8000` → Backend
- `http://localhost:8001` → MCP Server

#### 🐳 Container → Container

When containers communicate with each other, they must use the Docker service name.

**Example:**
- Frontend → Backend: `http://backend:8000`
- Backend → MCP Server: `http://mcp:8001`

Docker automatically provides internal DNS resolution for service names defined in `docker-compose.yml`.

---

## 📊 Networking Overview

```text
Browser
   │
   │ http://localhost:3000
   ▼
Frontend Container
   │
   │ http://backend:8000
   ▼
Backend Container
   │
   │ http://mcp:8001
   ▼
MCP Server Container
```

---

## ✅ Key Takeaways

- ✔️ **Docker Compose loads `.env`** from the root directory.
- ✔️ **All services should share** a single `.env` file.
- ✔️ **Browsers must use** `localhost` URLs.
- ✔️ **Containers must use** service names to communicate.
- ✔️ **Docker automatically provides** service-name DNS resolution.
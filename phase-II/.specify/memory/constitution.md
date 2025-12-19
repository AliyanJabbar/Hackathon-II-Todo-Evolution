<!-- SYNC IMPACT REPORT:
Version change: N/A (initial version) → 1.0.0
Modified principles: N/A
Added sections: All principles and sections added as initial constitution
Removed sections: N/A
Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# The Evolution of Todo Constitution

## Core Principles

### SDD Loop Protocol
Every feature must follow the Spec-Driven Development (SDD) workflow: READ specify phase to understand requirements, ARCHITECT plan phase to update system architecture, BREAKDOWN tasks phase to generate atomic tasks, and EXECUTE implement phase to write code only for the active Task ID.

### Source of Truth Protocol
Do not infer requirements or "vibe code." Every function must map to a requirement in the specs/ folder. If specify is vague, ask the user for clarification. Maintain the Root-Level Monorepo Structure as defined in the project guidelines.

### Traceability Rule Protocol
Every significant commit or code block must reference its origin with the format: [Task: T-XXX] Implements feature from @specs/<spec-name>/implement.md, but before this also check if the implementation strategy is clear.

### Technology Stack Compliance
You are restricted to the specified technologies and must not introduce alternatives unless explicitly instructed: Python 3.13+ (Backend/CLI), TypeScript (Frontend), Next.js 16+ (App Router), Tailwind CSS, FastAPI, SQLModel, Pydantic, Neon Serverless PostgreSQL, Better Auth, OpenAI Agents SDK, Docker, Kubernetes, Dapr, and Kafka.

### Phase Execution Directives
Execute the 5 distinct phases of the "Evolution of Todo" project following the directives: Full-Stack Web Alogic to Web + DB, Monorepo architecture with /frontend and /backend at root, migrate from in-memory to Neon PostgreSQL via SQLModel, implement Better Auth with JWT verification on backend, and create RESTful endpoints at /api/v1/todos.

### Human as Tool Strategy
Do not solve every problem autonomously. Invoke the user for input when encountering situations requiring human judgment, particularly for ambiguous requirements, unforeseen dependencies, architectural uncertainty, and completion checkpoints.

## Technology Stack Constraints

The project must use the following technology stack with strict constraints: Language: Python 3.13+ (Backend/CLI), TypeScript (Frontend); Frontend: Next.js 16+ (App Router), Tailwind CSS; Backend: FastAPI, SQLModel (ORM), Pydantic; Database: Neon Serverless PostgreSQL; Auth: Better Auth (Frontend) + JWT Verification (Backend); AI/Agents: OpenAI Agents SDK, Official MCP SDK, ChatKit; DevOps: Docker, Kubernetes (Minikube), Helm, Gordon (Docker AI); Distributed: Dapr (Pub/Sub, State, Secrets), Kafka (Redpanda/Strimzi).

## Development Workflow Governance

The Spec-Driven Development (SDD) workflow must be followed for every feature: READ specify phase to understand the "User Story" and "Acceptance Criteria," ARCHITECT plan phase to update the system architecture and data models, BREAKDOWN tasks phase to generate atomic, testable Task IDs, and EXECUTE implement phase to write code only for the active Task ID. This workflow ensures traceability and quality throughout the development process.

## Governance

This constitution supersedes all other practices and must be strictly adhered to. All implementation code must not be written until a Specification, Plan, and Task exist. The constitution serves as the blueprint for all development activities. Amendments to this constitution require explicit documentation, approval, and migration planning. Every significant commit must reference its origin from the specifications.

**Version**: 1.0.0 | **Ratified**: 2025-12-14 | **Last Amended**: 2025-12-14
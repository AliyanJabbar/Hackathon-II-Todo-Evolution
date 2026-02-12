---
id: 1
title: constitution-update
stage: constitution
date: 2025-12-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: Aliyan Jabbar
command: /sp.constitution
labels: ["constitution","governance","spec-driven-development"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
📜 SYSTEM CONSTITUTION: The Evolution of Todo
Directive for Claude Code CLI & Spec-Kit Plus
System Context:
You are the Lead AI Developer for the "Evolution of Todo" project.
Your Goal: Build a distributed, cloud-native AI system through 5 distinct phases.
Your Constraint: You must strictly adhere to Spec-Driven Development (SDD) using Spec-Kit Plus.
Primary Command:
"Do not write implementation code until a Specification, Plan, and Task exist. You are the Builder; the Spec is the Blueprint."

1. THE GOVERNANCE PROTOCOLS (Non-Negotiable)
Protocol A: The SDD Loop
You must execute the following workflow for every feature:
READ specify phase: Understand the "User Story" and "Acceptance Criteria."
ARCHITECT plan phase: Update the system architecture and data models.
BREAKDOWN tasks phase: Generate atomic, testable Task IDs.
EXECUTE implement phase: Write code only for the active Task ID.
Protocol B: The Source of Truth
You will not infer requirements. If specify is vague, ask the user for clarification.
You will not "vibe code." Every function must map to a requirement in the specs/ folder.
You must maintain a Root-Level Monorepo Structure (defined below).
Protocol C: The Traceability Rule
Every significant commit or code block must reference its origin:
Format: [Task: T-XXX] Implements feature from @specs/<spec-name>/implement.md, but before this also check if the implementation strategy is clear.

2. THE TECHNOLOGY STACK (Strict Constraints)
You are restricted to the following technologies. Do not introduce alternatives unless explicitly instructed.
Layer    Technology
Language    Python 3.13+ (Backend/CLI), TypeScript (Frontend)
Frontend    Next.js 16+ (App Router), Tailwind CSS
Backend    FastAPI, SQLModel (ORM), Pydantic
Database    Neon Serverless PostgreSQL
Auth    Better Auth (Frontend) + JWT Verification (Backend)
AI/Agents    OpenAI Agents SDK, Official MCP SDK, ChatKit
DevOps    Docker, Kubernetes (Minikube), Helm, Gordon (Docker AI)
Distributed    Dapr (Pub/Sub, State, Secrets), Kafka (Redpanda/Strimzi)

3. PHASE EXECUTION DIRECTIVES
Full-Stack Web Alogic to Web + DB.
Architecture: Monorepo (/frontend and /backend at root).
Data: Migrate from in-memory to Neon PostgreSQL via SQLModel.
Security: Implement Better Auth. The Backend must verify JWT tokens on every request.
API: RESTful endpoints (/api/v1/todos).

4. DIRECTORY STRUCTURE (The Map)
You must organize the file system some way like this as follows (Root-Level Monorepo):
code

├── .spec-kit/              # Spec-Kit Configuration
├── AGENTS.md               # Your instructions (this file)
├── CLAUDE.md               # Redirects to AGENTS.md
├── specs/                  # THE TRUTH
│   ├── constitution/       # Principles
│   ├── features/           # Functional Requirements
│   ├── architecture/       # System Design
│   └── tasks/              # Active Task Lists
├── frontend/               # Next.js 16+ App
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/                # FastAPI App
│   ├─pplication
Objective: Port
```

## Response snapshot

I have successfully updated the project constitution for "The Evolution of Todo" project. Here's the summary:

**New Version**: 1.0.0 (initial version)
**Bump Rationale**: This is the initial creation of the constitution based on the user's requirements for the "Evolution of Todo" project, establishing the foundational governance protocols, technology stack constraints, and development workflow governance.

**Files Updated**:
- `.specify/memory/constitution.md` - Complete rewrite with project-specific governance

**Constitution Content**:
- 6 Core Principles established based on user's SDD protocols
- Technology Stack Constraints section
- Development Workflow Governance section
- Governance section with amendment procedures

**Follow-up Items**:
- The constitution template references in plan-template.md, spec-template.md, and tasks-template.md may need review to ensure they properly reference the new constitution principles
- Future templates should reference the specific principles established in this constitution

The constitution now serves as the authoritative governance document for the "Evolution of Todo" project, establishing the Spec-Driven Development workflow as the required approach and defining the technology constraints and protocols that must be followed.

## Outcome

- ✅ Impact: Created initial project constitution with governance protocols
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with project-specific governance
- 🔁 Next prompts: Plan phase to architect the system based on the constitution
- 🧠 Reflection: Constitution provides clear governance framework for future development

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - constitution properly created with all required elements
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin specification phase based on constitution protocols
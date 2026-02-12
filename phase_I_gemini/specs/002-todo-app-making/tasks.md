# Phase-I Todo App — Task Breakdown

**Feature Branch**: `002-todo-app-making`  
**Created**: 2025-12-07  
**Status**: Draft  
**Related Plan**: `plan.md`  
**Related Spec**: `spec.md`

---

# Task List (Detailed and Actionable)

---

## 🟦 Task Group 1 — Project Setup (P1)

### ✔️ Task 1.1 — Initialize UV Project
- Create environment using `uv venv`.
- Generate `pyproject.toml`.

### ✔️ Task 1.2 — Create initial folder structure
- Root directory only (no `src/` folder).
- Add placeholder files:
  - `main.py`
  - `todo.py`

### ✔️ Task 1.3 — Add required metadata files
- Create `constitution.json`
- Create `README.md`
- Create `CLAUDE.md`

---

## 🟩 Task Group 2 — Implement `todo.py` Logic (P1)

### ✔️ Task 2.1 — Create Task model
- Define class `Task`
- Fields: `id`, `title`, `description`, `completed`

### ✔️ Task 2.2 — Create in-memory storage
- A list or dictionary to store tasks.
- Implement ID auto-increment.

### ✔️ Task 2.3 — Implement CRUD operations
- `add_task(title, description)`
- `get_all_tasks()`
- `update_task(task_id, title, description)`
- `delete_task(task_id)`

### ✔️ Task 2.4 — Implement completion toggles
- `mark_complete(task_id)`
- `mark_incomplete(task_id)`

### ✔️ Task 2.5 — Error handling for invalid IDs
- Safe lookups
- Return meaningful messages

---

## 🟧 Task Group 3 — Implement `main.py` Console UI (P1)

### ✔️ Task 3.1 — Build main menu loop
- Options 1–7 (Add, View, Update, Delete, Complete, Incomplete, Exit)

### ✔️ Task 3.2 — Connect menu options to `todo.py`
- Call correct functions
- Print results/messages

### ✔️ Task 3.3 — Input validation
- Block empty title
- Ensure task IDs are integers
- Handle unexpected input gracefully

### ✔️ Task 3.4 — Task output formatting
- Show `[✓]` or `[ ]` icons
- Print ID, title, description

---

## 🟨 Task Group 4 — Testing & QA (P1)

### ✔️ Task 4.1 — Functional tests
- Verify each operation works independently.

### ✔️ Task 4.2 — Scenario tests
- Add → Update → Complete → Delete → View.

### ✔️ Task 4.3 — Edge-case tests
- Invalid ID
- Empty input
- Non-numeric menu choice
- No tasks available

---

## 🟪 Task Group 5 — Final Polish (P2)

### ✔️ Task 5.1 — Write documentation
- Setup steps
- Usage steps
- Console flow

### ✔️ Task 5.2 — Update CLAUDE.md
- Add Claude Code automation instructions.

### ✔️ Task 5.3 — Save spec history
- Move finalized `spec.md` to `specs_history/`.

---

# Completion Criteria

The feature is considered **Done** when:

- All tasks are checked.
- Console app runs smoothly.
- All features meet acceptance criteria in `spec.md`.
- Documentation is complete.

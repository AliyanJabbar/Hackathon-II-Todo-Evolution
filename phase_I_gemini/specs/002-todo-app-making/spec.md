# Feature Specification: Phase-I Todo In-Memory Console Application

**Feature Branch**: `002-todo-app-making`  
**Created**: 2025-12-07  
**Status**: Draft  
**Input**: Phase-I requirements for Todo In-Memory Python Console App (Basic Level)

---

# User Scenarios & Testing *(mandatory)*

The Todo application must work fully from the console and keep all tasks **in memory**. It must support:

- Adding tasks  
- Viewing tasks  
- Updating task details  
- Deleting tasks  
- Marking tasks as complete/incomplete  

---

## User Story 1 — Add a Task (Priority: P1)

As a user, I want to add a new todo task with a title and description so that I can keep track of my tasks.

**Why this priority**: This is the core functionality of the application.

**Independent Test**:  
Run the app → choose "Add Task" → provide title/description → confirm that the task appears when listing tasks.

### Acceptance Scenarios

1. **Given** the user chooses “Add Task”,  
   **When** a title and description are entered,  
   **Then** a new task is added with a unique ID and default `completed=False`.

2. **Given** the user tries to add a task with an empty title,  
   **When** they submit,  
   **Then** the system rejects the entry and informs the user.

---

## User Story 2 — View All Tasks (Priority: P1)

As a user, I want to view all tasks along with their status so I can see my progress.

**Independent Test**:  
After adding tasks, run “View Tasks” and verify IDs, titles, descriptions, and completion markers.

### Acceptance Scenarios

1. **Given** there are tasks in memory,  
   **When** the user selects “View Tasks”,  
   **Then** the system prints every task with its ID and completion status (`[✓]` or `[ ]`).

2. **Given** there are no tasks,  
   **When** the user selects “View Tasks”,  
   **Then** the system displays “No tasks found”.

---

## User Story 3 — Update Task (Priority: P2)

As a user, I want to update an existing task’s title or description.

**Independent Test**:  
Add a task → run Update → check if the changes appear when listed.

### Acceptance Scenarios

1. **Given** a valid task ID,  
   **When** the user updates title/description,  
   **Then** changes are saved in memory.

2. **Given** an invalid task ID,  
   **When** the user attempts update,  
   **Then** the system notifies “Task not found.”

---

## User Story 4 — Delete Task (Priority: P1)

As a user, I want to delete a task by ID so I can remove tasks that are no longer needed.

**Independent Test**:  
Add a task → delete it → view tasks → confirm removal.

### Acceptance Scenarios

1. **Given** a valid ID,  
   **When** Delete is selected,  
   **Then** the task is removed.

2. **Given** an invalid ID,  
   **When** attempting delete,  
   **Then** the system shows an error message.

---

## User Story 5 — Mark Task Complete/Incomplete (Priority: P1)

As a user, I want to mark a task as completed or incomplete.

**Independent Test**:  
Add → mark complete → view → ensure `[✓]` is shown.

### Acceptance Scenarios

1. **Given** a task exists,  
   **When** the user toggles its completion,  
   **Then** `completed=True/False` updates correctly.

2. **Given** a non-existing ID,  
   **Then** an error message is shown.

---

## Edge Cases

- User enters a non-numeric ID → app must handle gracefully.  
- User enters an empty input where text is required.  
- Application should not crash if user types an unknown menu option.  
- All data resets when the app restarts (in-memory requirement).  

---

# Requirements *(mandatory)*

## Functional Requirements

---

## **todo.py (Task Model and Manager)**

- **FR-001**: MUST define a `Task` class with attributes: `id`, `title`, `description`, `completed`.  
- **FR-002**: MUST maintain tasks inside an in-memory list or dictionary.  
- **FR-003**: MUST expose functions:  
  - `add_task(title, description)`  
  - `get_all_tasks()`  
  - `update_task(task_id, title, description)`  
  - `delete_task(task_id)`  
  - `mark_complete(task_id)`  
  - `mark_incomplete(task_id)`  
- **FR-004**: MUST auto-generate incremental integer IDs.  
- **FR-005**: MUST return clear success/error responses.  

---

## **main.py (Console Interface)**

- **FR-006**: MUST provide a console-driven menu:  
  1. Add Task  
  2. View Tasks  
  3. Update Task  
  4. Delete Task  
  5. Mark Complete  
  6. Mark Incomplete  
  7. Exit  

- **FR-007**: MUST validate user input before forwarding to `todo.py` functions.  
- **FR-008**: MUST correctly print task lists with completion indicators (`[✓]` or `[ ]`).  
- **FR-009**: MUST never crash due to bad input; always handle exceptions gracefully.  

---

# Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add tasks with title+description 100% of the time.  
- **SC-002**: The task list shows accurate completion states.  
- **SC-003**: Updates and deletes work correctly for both valid and invalid IDs.  
- **SC-004**: Application runs entirely via console and resets when closed.  
- **SC-005**: Code follows clean structure:  
  - `todo.py` → business logic  
  - `main.py` → console interface  
- **SC-006**: Works in UV virtual environment on Python 3.13+.  

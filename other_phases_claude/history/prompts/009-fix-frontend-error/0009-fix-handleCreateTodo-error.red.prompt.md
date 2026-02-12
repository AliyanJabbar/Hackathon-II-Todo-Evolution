---
id: 0009
title: "Fix handleCreateTodo is not defined error"
stage: "red"
date: "2025-12-21"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "009-fix-frontend-error"
branch: "009-fix-frontend-error"
user: "Aliyan Jabbar"
command: "/sp.specify debug this error : ## Error Type Runtime ReferenceError ## Error Message handleCreateTodo is not defined"
labels: ["bug-fix", "frontend", "react", "props", "typescript"]
links:
  spec: "specs/009-fix-frontend-error/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/src/components/home/demo-section.tsx"
  - "specs/009-fix-frontend-error/spec.md"
  - "specs/009-fix-frontend-error/plan.md"
  - "specs/009-fix-frontend-error/tasks.md"
  - "specs/009-fix-frontend-error/checklists/requirements.md"
tests: []
outcome: "Successfully fixed the ReferenceError by properly passing the handleCreateTodo function from Board component to Column components, resolving the 'handleCreateTodo is not defined' error."
evaluation: "The fix was successful - the error no longer occurs and the add card functionality works properly. The solution involved updating type definitions, passing the function as a prop, and updating the component signature to properly accept the function."
---

# Fix handleCreateTodo is not defined error

## User Input
debug this error : ## Error Type
Runtime ReferenceError

## Error Message
handleCreateTodo is not defined

## Summary of Changes
Fixed a frontend bug where the `handleCreateTodo` function was not being passed from the `Board` component to the `Column` component, causing a ReferenceError when users tried to add new cards to the Kanban board.

## Root Cause
The `handleCreateTodo` function was defined in the `Board` component but was not passed down to the `Column` components as a prop. The `AddCard` component inside `Column` was trying to access `handleCreateTodo` which was not available in its scope.

## Solution
1. Updated the `ColumnProps` type definition to include the `onCreateTodo` function
2. Added `onCreateTodo={handleCreateTodo}` prop to all 4 Column components in the Board component
3. Updated the Column component signature to accept the `onCreateTodo` prop
4. Verified the AddCard component receives the function correctly

## Files Modified
- `frontend/src/components/home/demo-section.tsx` - Fixed the prop passing issue
- Created spec, plan, and tasks for the fix

## Verification
- The ReferenceError no longer occurs
- Users can successfully add new tasks using the "Add card" button
- All existing Kanban board functionality remains intact
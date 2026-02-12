# Specification: Modern CLI Todo Application

## 1. Project Overview
A professional-grade Command Line Interface (CLI) application for task management, inspired by the aesthetic of high-end AI tools like Gemini and Claude CLI.

## 2. Core Objectives
- Provide a visually engaging user experience using terminal-based gradients and panels.
- Offer an intuitive, menu-driven interface for CRUD operations on tasks.
- Implement a real-time "Dashboard" feel where the task list is always visible.

## 3. Technical Stack
- **Language:** Python 3.10+
- **Primary Library:** [Rich](https://github.com/Textualize/rich) (for terminal formatting, tables, and progress/transitions).
- **Core Modules:** `os` (screen clearing), `datetime` (live metadata), `time` (transition handling).

## 4. Functional Requirements
- **Create:** Users can add tasks with a title and description.
- **Read:** A persistent "Active Task Matrix" displayed at the top of the interface.
- **Update:** Ability to mark tasks as "Complete" (Status toggle).
- **Delete:** Remove tasks by ID from the active list.
- **Auto-Refresh:** The system clears and re-renders the UI automatically after every action.

## 5. UI/UX Design Standards
- **Logo:** High-altitude ASCII art with a vertical color gradient (Cyan to Magenta).
- **Dashboard:** Metadata bar showing current date/time and task statistics (Total, Pending, Done).
- **Components:** Rounded borders (`box.ROUNDED`) and high-visibility status icons (●/○).
- **Transitions:** Non-blocking 1.2s to 1.5s pauses for success messages to ensure readability.
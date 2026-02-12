# phase-I: A Command-Line Todo Application

This is a simple, command-line based todo application written in Python. It allows users to manage their tasks efficiently from the terminal.

## Features

*   **Add Task**: Add a new task with a title and description.
*   **View Tasks**: View the list of all tasks with their completion status.
*   **Update Task**: Modify the title and/or description of an existing task.
*   **Delete Task**: Remove a task from the list.
*   **Mark Complete**: Mark a task as complete or incomplete.

## Getting Started

### Prerequisites

*   Python 3.13 or higher
*   `uv` package manager (or `pip`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AliyanJabbar/Hackathon-II-Todo-Evolution.git
    cd Hackathon-II-Todo-Evolution
    ```

2.  **Install dependencies:**
    This project uses `uv` for package management. To install the dependencies, run:
    ```bash
    uv pip sync
    ```
    Alternatively, if you are using `pip`, you can install the dependencies from the `uv.lock` file (you might need to convert it to a `requirements.txt` file first).

### Running the Application

To start the todo application, run the following command in your terminal:

```bash
python main.py
```

You will be presented with a menu of options to manage your tasks.

## Development Process

This project is being developed using the **Gemini CLI** and follows the principles of **Spec-Driven Development (SDD)**.

*   **`/.specify`**: Contains templates and scripts for the development process.
*   **`/history`**: Stores the history of prompts and interactions with the Gemini CLI.
*   **`/specs`**: Holds the specifications, plans, and tasks for each feature under development.

The `GEMINI.md` file in the root directory contains the rules and guidelines for the AI agent assisting with the development.

## Project Structure

*   `main.py`: The main entry point for the application.
*   `todo.py`: Contains the core logic for the todo application, including the `Task` and `TodoApp` classes.
*   `pyproject.toml`: Defines the project metadata and dependencies.
*   `.python-version`: Specifies the Python version used in this project.
*   `uv.lock`: The lock file for the `uv` package manager.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

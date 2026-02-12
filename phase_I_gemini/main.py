import os
import time
from datetime import datetime
from typing import List
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.align import Align
from rich.table import Table
from rich.prompt import Prompt
from rich.rule import Rule
from rich import box

# Initialize Rich Console
console = Console()

class Task:
    def __init__(self, task_id: int, title: str, description: str):
        self.id = task_id
        self.title = title
        self.description = description
        self.completed = False

class TodoApp:
    def __init__(self):
        self.tasks: List[Task] = []
        self.next_id: int = 1

    def display_welcome(self):
        """Enhanced modern signature with gradients and metadata."""
        ascii_art = [
            r"  _____ ___  ____   ___     ____ _     ___ ",
            r" |_   _/ _ \|  _ \ / _ \   / ___| |   |_ _|",
            r"   | || | | | | | | | | | | |   | |    | | ",
            r"   | || |_| | |_| | |_| | | |___| |___ | | ",
            r"   |_| \___/|____/ \___/   \____|_____|___|"
        ]

        colors = ["#00f2fe", "#4facfe", "#7367f0", "#ce9ffc", "#f97794"]
        styled_ascii = Text()
        for i, line in enumerate(ascii_art):
            styled_ascii.append(line + "\n", style=colors[i % len(colors)])

        now = datetime.now().strftime("%A, %b %d • %H:%M")
        total = len(self.tasks)
        completed = sum(1 for t in self.tasks if t.completed)
        pending = total - completed

        stats = Text.assemble(
            (f" {now} ", "bold white on #3a3a3a"),
            "  ",
            (f" 📂 Total: {total} ", "bold cyan"),
            (f" ⏳ Pending: {pending} ", "bold yellow"),
            (f" ✅ Done: {completed} ", "bold green"),
        )

        header_content = Text.assemble(
            styled_ascii,
            "\n",
            Text("Advanced Task Management System", style="italic gray50"),
            "\n\n",
            stats
        )

        console.print(
            Panel(
                Align.center(header_content),
                box=box.ROUNDED,
                border_style="bright_blue",
                padding=(1, 2),
                title="[bold white]CORE INTERFACE[/bold white]",
                subtitle="[dim white]v1.1.0[/dim white]"
            )
        )
        console.print(Rule(style="dim blue"))

    def add_task(self):
        console.print("\n[bold green]➕ CREATE NEW TASK[/bold green]")
        title = Prompt.ask("[bold]Title[/bold]")
        desc = Prompt.ask("[bold]Description[/bold]")
        task = Task(self.next_id, title, desc)
        self.tasks.append(task)
        self.next_id += 1
        console.print(f"\n[bold green]✔[/bold green] Task added successfully! [dim](Refreshing...)[/dim]")
        time.sleep(1.5) # Program waits 1.5 seconds then continues automatically

    def view_tasks(self):
        if not self.tasks:
            console.print("\n[dim yellow]Your task list is currently empty.[/dim yellow]")
            return

        table = Table(
            show_header=True, 
            header_style="bold magenta", 
            box=box.SIMPLE_HEAVY,
            expand=True,
            title="[bold]CURRENT OBJECTIVES[/bold]"
        )
        table.add_column("ID", style="dim", width=4)
        table.add_column("Status", justify="center", width=12)
        table.add_column("Title", style="bold")
        table.add_column("Description", style="italic")

        for task in self.tasks:
            status = "[green]DONE[/green]" if task.completed else "[red]PENDING[/red]"
            icon = "●" if task.completed else "○"
            table.add_row(str(task.id), f"{icon} {status}", task.title, task.description)

        console.print("\n", table)

    def mark_complete(self):
        if not self.tasks: return
        task_id = Prompt.ask("\n[bold yellow]Enter Task ID to complete[/bold yellow]")
        for task in self.tasks:
            if str(task.id) == task_id:
                task.completed = True
                console.print(f"[bold green]✔ Objective {task_id} cleared! [dim](Refreshing...)[/dim]")
                time.sleep(1.2)
                return
        console.print("[bold red]ID not found.[/bold red]")
        time.sleep(1)

    def delete_task(self):
        if not self.tasks: return
        task_id = Prompt.ask("\n[bold red]Enter Task ID to delete[/bold red]")
        for task in self.tasks:
            if str(task.id) == task_id:
                self.tasks.remove(task)
                console.print(f"[bold red]✘ Task {task_id} removed. [dim](Refreshing...)[/dim]")
                time.sleep(1.2)
                return
        console.print("[bold red]ID not found.[/bold red]")
        time.sleep(1)

def main():
    app = TodoApp()
    show_list = False # Toggle to keep the list on screen
    
    while True:
        console.clear() 
        app.display_welcome()

        # By always showing the tasks if they exist, you don't need to "click enter"
        # to see the list and go back to menu. It's all on one screen.
        app.view_tasks()

        console.print("\n[bold blue]COMMANDS:[/bold blue]")
        console.print(" [1] Add Task  [2] Refresh  [3] Complete  [4] Delete  [5] Exit", style="cyan")

        choice = Prompt.ask(
            "\n[bold]Execute Command[/bold]", 
            choices=["1", "2", "3", "4", "5"], 
            default="2",
            show_choices=False
        )

        if choice == "1":
            app.add_task()
        elif choice == "2":
            # Refreshing happens automatically via the loop
            pass 
        elif choice == "3":
            app.mark_complete()
        elif choice == "4":
            app.delete_task()
        elif choice == "5":
            console.print("[bold italic blue]System Shutting Down. Goodbye![/bold italic blue] 👋")
            time.sleep(1)
            break

if __name__ == "__main__":
    main()
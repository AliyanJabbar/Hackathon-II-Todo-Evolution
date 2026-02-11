"use client";

import KanbanBoard from "@/components/todo/kanban-board";

export default function TodoPage() {
  return (
    <div className="flex flex-col gap-16 pb-10">
      <KanbanBoard />
    </div>
  );
}

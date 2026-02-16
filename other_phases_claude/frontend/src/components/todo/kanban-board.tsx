"use client";

import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  DragEvent,
  FormEvent,
} from "react";
import { Plus, Trash2, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import TodoAPI, { Todo } from "@/services/api";
import { useSession } from "next-auth/react";
import BoardSkeleton from "./board-skeleton";

// --- Types ---
type ColumnType = "backlog" | "todo" | "doing" | "done";

type CardType = {
  title: string;
  id: string;
  column: ColumnType;
  stableId: string;
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
  onUpdateTodo: (id: string, newColumn: ColumnType) => void;
  onCreateTodo: (title: string, column: ColumnType) => void;
  onDeleteTodo: (id: string) => void;
};

type CardProps = CardType & {
  handleDragStart: (e: DragEvent, card: CardType) => void;
  onDeleteTodo: (id: string) => void;
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

// --- Main Component ---
export default function KanbanBoard() {
  return (
    <section id="demo" className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4 border border-indigo-500/20">
            <Sparkles size={14} />
            <span>Interactive Kanban Board</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Manage Complexity with Ease
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Drag and drop tasks to prioritize your workflow.
          </p>
        </div>
        <Board />
      </motion.div>
    </section>
  );
}

const Board = () => {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken; // Access our custom token
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const tempIdCounter = useRef(0);

  useEffect(() => {
    const fetchTodos = async () => {
      if (status !== "authenticated" || !token) {
        setLoading(false);
        return;
      }
      try {
        const todos = await TodoAPI.getTodos(token);
        const cardData = todos.map(todo => ({
          id: todo.id.toString(),
          title: todo.title,
          column: todo.category as ColumnType,
          stableId: todo.id.toString()
        }));
        setCards(cardData);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [status, token]);

// WebSocket connection for real-time updates
  useEffect(() => {
    if (status !== "authenticated" || !token) return;

    const wsUrl = `ws://localhost:8000/ws/todos?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.action === "create") {
          const realCard = {
            id: data.todo.id.toString(),
            title: data.todo.title,
            column: data.todo.category as ColumnType,
            stableId: data.todo.id.toString()
          };
          
          setCards(prev => {
            // 1. If real card exists, ignore
            if (prev.some(card => card.id === realCard.id)) return prev;

            // 2. Check for matching temp card (by title/column)
            const tempCardIndex = prev.findIndex(card =>
              card.id.startsWith('temp-') &&
              card.title === realCard.title &&
              card.column === realCard.column
            );

            if (tempCardIndex !== -1) {
              const updated = [...prev];
              updated[tempCardIndex] = realCard;
              return updated;
            }

            // 3. New external addition
            return [...prev, realCard];
          });

        } else if (data.action === "update") {
          setCards(prev => prev.map(card =>
            // Ensure ID comparison is string-to-string
            card.id === data.todo.id.toString()
              ? { ...card, title: data.todo.title, column: data.todo.category as ColumnType }
              : card
          ));

        } else if (data.action === "delete") {
          setCards(prev => prev.filter(card => card.id !== data.todo.id.toString()));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");
    
    return () => {
      ws.close();
    };
  }, [status, token]);

  const handleCreateTodo = async (title: string, column: ColumnType) => {
    if (!token) return;

    // Generate temporary ID for optimistic update
    tempIdCounter.current += 1;
    const tempId = `temp-${tempIdCounter.current}`;
    const optimisticCard: CardType = { id: tempId, title, column, stableId: tempId };

    // Optimistically add to UI immediately
    setCards(prev => [...prev, optimisticCard]);

    try {
      const newTodo = await TodoAPI.createTodo({ title, category: column }, token);
      // Update the temporary card with real data, or remove temp if real card already exists
      setCards(prev => {
        const realId = newTodo.id.toString();
        // If real card already exists (from WebSocket), just remove temp card
        if (prev.some(card => card.id === realId)) {
          return prev.filter(card => card.id !== tempId);
        } else {
          // Update temp card to real card
          return prev.map(card =>
            card.id === tempId
              ? { id: realId, title: newTodo.title, column: newTodo.category, stableId: realId }
              : card
          );
        }
      });
    } catch (error) {
      console.error(error);
      // Rollback: remove the optimistic card on failure
      setCards(prev => prev.filter(card => card.id !== tempId));
    }
  };

  const handleUpdateTodo = async (id: string, newColumn: ColumnType) => {
    if (!token) return;

    const currentCard = cards.find(card => card.id === id);
    if (!currentCard) return;

    // Store original state for rollback
    const originalColumn = currentCard.column;

    // Optimistically update UI immediately
    setCards(prev => prev.map(card => card.id === id ? { ...card, column: newColumn } : card));

    try {
      const todoId = parseInt(id);
      await TodoAPI.updateTodo(todoId, {
        id: todoId,
        title: currentCard.title,
        category: newColumn
      }, token);
    } catch (error) {
      console.error(error);
      // Rollback: revert to original column on failure
      setCards(prev => prev.map(card => card.id === id ? { ...card, column: originalColumn } : card));
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!token) return;

    // Store the card for potential rollback
    const cardToDelete = cards.find(card => card.id === id);
    if (!cardToDelete) return;

    // Optimistically remove from UI immediately
    setCards(prev => prev.filter(card => card.id !== id));

    try {
      await TodoAPI.deleteTodo(parseInt(id), token);
    } catch (error) {
      console.error(error);
      // Rollback: add the card back on failure
      setCards(prev => [...prev, cardToDelete]);
      toast.error("Failed to delete todo. Please try again.");
    }
  };

  if (status === "loading" || loading) return <BoardSkeleton />;
  return (
    <div className="w-full py-4">
<div className="w-full flex flex-col gap-6 md:grid md:grid-cols-2 xl:flex xl:flex-row xl:items-start min-h-75 xl:overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Column
          title="Backlog"
          column="backlog"
          headingColor="text-slate-400"
          cards={cards}
          setCards={setCards}
          onUpdateTodo={handleUpdateTodo}
          onCreateTodo={handleCreateTodo}
          onDeleteTodo={handleDeleteTodo}
        />
        <Column
          title="Todo"
          column="todo"
          headingColor="text-yellow-200"
          cards={cards}
          setCards={setCards}
          onUpdateTodo={handleUpdateTodo}
          onCreateTodo={handleCreateTodo}
          onDeleteTodo={handleDeleteTodo}
        />
        <Column
          title="In Progress"
          column="doing"
          headingColor="text-blue-200"
          cards={cards}
          setCards={setCards}
          onUpdateTodo={handleUpdateTodo}
          onCreateTodo={handleCreateTodo}
          onDeleteTodo={handleDeleteTodo}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-emerald-200"
          cards={cards}
          setCards={setCards}
          onUpdateTodo={handleUpdateTodo}
          onCreateTodo={handleCreateTodo}
          onDeleteTodo={handleDeleteTodo}
        />

        {/* Desktop & Tablet Burn Barrel */}
        <div className="hidden md:block md:col-span-2 xl:col-auto h-auto">
           <BurnBarrel setCards={setCards} onDeleteTodo={handleDeleteTodo} />
        </div>

        {/* Mobile Burn Barrel */}
        <div className="hidden">
           <p className="text-center text-xs text-slate-600 mb-2 font-mono uppercase tracking-wider">Drag here to delete</p>
           <BurnBarrel setCards={setCards} onDeleteTodo={handleDeleteTodo} mobile />
        </div>
      </div>
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards, onUpdateTodo, onCreateTodo, onDeleteTodo }: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      const cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      // Update the column on the backend
      onUpdateTodo(cardId, column);

      // Update the local state
      copy = copy.filter((c) => c.id !== cardId);
      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push({ ...cardToTransfer, column });
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === -1) return;
        copy.splice(insertAtIndex, 0, { ...cardToTransfer, column });
      }
      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => { i.style.opacity = "0"; });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY, element: indicators[indicators.length - 1] }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[]);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-full xl:w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between sticky top-0 bg-transparent z-10">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-slate-500 font-mono">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full min-h-37.5 w-full rounded-xl transition-colors ${
          active ? "bg-slate-800/50" : "bg-transparent"
        }`}
      >
        {filteredCards.map((c) => (
          <Card key={c.stableId} {...c} handleDragStart={handleDragStart} onDeleteTodo={onDeleteTodo} />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard key={column} column={column} setCards={setCards} onCreateTodo={onCreateTodo} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, stableId, handleDragStart, onDeleteTodo }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={stableId}
        draggable="true"
        onDragStart={(e) => handleDragStart(e as any, { title, id, column, stableId })}
        className="relative cursor-grab rounded-lg border border-slate-700 bg-slate-800 p-3 active:cursor-grabbing shadow-sm hover:border-indigo-500/50 transition-colors"
      >
        <p className="text-sm text-slate-100">{title}</p>
        <button
          onClick={() => onDeleteTodo(id)}
          className="md:hidden absolute top-2.5 right-2 p-1 text-slate-400 hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-indigo-500 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards, onDeleteTodo, mobile = false }: { setCards: Dispatch<SetStateAction<CardType[]>>; onDeleteTodo: (id: string) => void; mobile?: boolean; }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => setActive(false);

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    // Delete from backend
    onDeleteTodo(cardId);
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid place-content-center rounded-xl border-2 border-dashed transition-all shrink-0 
      ${
        active
          ? "border-red-500 bg-red-500/10 text-red-500 scale-105"
          : "border-slate-800 bg-slate-900/20 text-slate-600 hover:border-slate-700 hover:text-slate-500"
      }
      ${
        mobile 
        ? "h-24 w-full" 
        : "h-32 md:h-36 xl:h-50 w-full xl:w-56 xl:mt-10"
      }
      `}
    >
      {active ? <Flame className="animate-bounce" size={mobile ? 24 : 32} /> : <Trash2 size={mobile ? 20 : 24} />}
    </div>
  );
};

const AddCard = ({ column, setCards, onCreateTodo }: { column: ColumnType; setCards: Dispatch<SetStateAction<CardType[]>>; onCreateTodo: (title: string, column: ColumnType) => void }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const taskText = text.trim();
    setText("");
    setAdding(false); // Close form immediately

    try {
      // Create todo via API
      await onCreateTodo(taskText, column);
    } catch (error) {
      console.error(error);
      // Re-open form on error so user can try again
      setAdding(true);
      setText(taskText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <>
      {adding ? (
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Add task..."
            className="w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm text-slate-50 placeholder-indigo-300/50 focus:outline-0 focus:ring-1 focus:ring-indigo-500"
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-slate-400">Ctrl+Enter (submit)</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-50">Cancel</button>
              <button type="submit" className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500">
                <span>Add</span>
                <Plus size={14} />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300">
          <span>Add card</span>
          <Plus size={14} />
        </button>
      )}
    </>
  );
};

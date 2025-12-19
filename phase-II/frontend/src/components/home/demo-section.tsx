"use client";

import React, {
  Dispatch,
  SetStateAction,
  useState,
  DragEvent,
  FormEvent,
} from "react";
import { Plus, Trash2, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// --- Types ---
type ColumnType = "backlog" | "todo" | "doing" | "done";

type CardType = {
  title: string;
  id: string;
  column: ColumnType;
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

type CardProps = CardType & {
  handleDragStart: (e: DragEvent, card: CardType) => void;
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

// --- Main Component ---
export default function DemoSection() {
  return (
    <section id="demo" className="container mx-auto px-4 py-12">
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
  const [cards, setCards] = useState<CardType[]>(DEFAULT_CARDS);

  return (
    <div className="w-full py-4">
      <div className="
        w-full 
        // Layouts
        flex flex-col gap-6           // Mobile
        md:grid md:grid-cols-2        // Tablet
        xl:flex xl:flex-row           // Desktop
        xl:items-start                // Align columns to top
        
        // Scroll Logic
        xl:overflow-x-auto 
        [scrollbar-width:none] 
        [-ms-overflow-style:none] 
        [&::-webkit-scrollbar]:hidden
      ">
        
        <Column
          title="Backlog"
          column="backlog"
          headingColor="text-slate-400"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Todo"
          column="todo"
          headingColor="text-yellow-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In Progress"
          column="doing"
          headingColor="text-blue-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-emerald-200"
          cards={cards}
          setCards={setCards}
        />

        {/* Desktop & Tablet Burn Barrel */}
        <div className="hidden md:block md:col-span-2 xl:col-auto h-auto">
           <BurnBarrel setCards={setCards} />
        </div>

        {/* Mobile Burn Barrel */}
        <div className="md:hidden mt-4 pb-4">
           <p className="text-center text-xs text-slate-600 mb-2 font-mono uppercase tracking-wider">Drag here to delete</p>
           <BurnBarrel setCards={setCards} mobile />
        </div>
      </div>
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }: ColumnProps) => {
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
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);
      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === -1) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
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
        className={`h-full min-h-[150px] w-full rounded-xl transition-colors ${
          active ? "bg-slate-800/50" : "bg-transparent"
        }`}
      >
        {filteredCards.map((c) => (
          <Card key={c.id} {...c} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e as any, { title, id, column })}
        className="cursor-grab rounded-lg border border-slate-700 bg-slate-800 p-3 active:cursor-grabbing shadow-sm hover:border-indigo-500/50 transition-colors"
      >
        <p className="text-sm text-slate-100">{title}</p>
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

const BurnBarrel = ({ setCards, mobile = false }: { setCards: Dispatch<SetStateAction<CardType[]>>; mobile?: boolean; }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => setActive(false);

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
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
        : "h-32 md:h-36 xl:h-[200px] w-full xl:w-56 xl:mt-10"
      }
      `}
    >
      {active ? <Flame className="animate-bounce" size={mobile ? 24 : 32} /> : <Trash2 size={mobile ? 20 : 24} />}
    </div>
  );
};

const AddCard = ({ column, setCards }: { column: ColumnType; setCards: Dispatch<SetStateAction<CardType[]>> }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;
    const newCard: CardType = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };
    setCards((pv) => [...pv, newCard]);
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add task..."
            className="w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm text-slate-50 placeholder-indigo-300/50 focus:outline-0 focus:ring-1 focus:ring-indigo-500"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-50">Cancel</button>
            <button type="submit" className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500">
              <span>Add</span>
              <Plus size={14} />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button layout onClick={() => setAdding(true)} className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300">
          <span>Add card</span>
          <Plus size={14} />
        </motion.button>
      )}
    </>
  );
};

const DEFAULT_CARDS: CardType[] = [
  { title: "Research AI Model integration", id: "1", column: "backlog" },
  { title: "Design Logo & Brand assets", id: "2", column: "backlog" },
  { title: "Initialize Next.js repo", id: "5", column: "todo" },
  { title: "Install Motion & Tailwind", id: "6", column: "todo" },
  { title: "Building Homepage", id: "8", column: "doing" },
  { title: "Read Hackathon Rules", id: "10", column: "done" },
];
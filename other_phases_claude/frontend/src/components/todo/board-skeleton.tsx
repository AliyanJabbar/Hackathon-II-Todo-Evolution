import { Skeleton } from "@/components/ui/skeleton";

export default function BoardSkeleton() {
  return (
    <div className="w-full py-4">
      <div className="w-full flex flex-col gap-6 md:grid md:grid-cols-2 xl:flex xl:flex-row xl:items-start min-h-75 xl:overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ColumnSkeleton title="Backlog" />
        <ColumnSkeleton title="Todo" />
        <ColumnSkeleton title="In Progress" />
        <ColumnSkeleton title="Complete" />

        {/* Desktop & Tablet Burn Barrel */}
        <div className="hidden md:block md:col-span-2 xl:col-auto h-auto">
          <BurnBarrelSkeleton />
        </div>
      </div>
    </div>
  );
}

function ColumnSkeleton({ title }: { title: string }) {
  return (
    <div className="w-full xl:w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between sticky top-0 bg-transparent z-10">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-6 rounded text-sm" />
      </div>
      <div className="h-full min-h-37.5 w-full rounded-xl bg-transparent">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <Skeleton className="w-full h-8 mt-2 rounded-lg" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="my-2">
      <Skeleton className="h-12 w-full rounded-lg border border-slate-700 bg-slate-800" />
    </div>
  );
}

function BurnBarrelSkeleton() {
  return (
    <div className="grid place-content-center rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/20 shrink-0 h-32 md:h-36 xl:h-50 w-full xl:w-56 xl:mt-10">
      <Skeleton className="h-6 w-6" />
    </div>
  );
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SummaryStripProps {
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export default function SummaryStrip({ summary }: SummaryStripProps) {
  const stats = [
    { 
      label: "Trees Detected", 
      value: summary.total_trees,
    },
    { 
      label: "Cycles Found", 
      value: summary.total_cycles,
    },
    { 
      label: "Largest Root", 
      value: summary.largest_tree_root || "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-[#0c0c0c]"
        >
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{s.label}</p>
          <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

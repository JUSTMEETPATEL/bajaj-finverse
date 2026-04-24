interface SummaryStripProps {
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export default function SummaryStrip({ summary }: SummaryStripProps) {
  const stats = [
    { label: "Trees", value: summary.total_trees },
    { label: "Cycles", value: summary.total_cycles },
    { label: "Largest Root", value: summary.largest_tree_root || "—" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900"
        >
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {s.value}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

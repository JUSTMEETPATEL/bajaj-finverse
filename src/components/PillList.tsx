interface PillListProps {
  title: string;
  items: string[];
  color: "red" | "yellow";
}

export default function PillList({ title, items, color }: PillListProps) {
  if (items.length === 0) return null;

  const colors = {
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${colors[color]}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

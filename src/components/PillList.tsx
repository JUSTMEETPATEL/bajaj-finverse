import { AlertCircle, AlertTriangle } from "lucide-react";

interface PillListProps {
  title: string;
  items: string[];
  type: "error" | "warning";
}

export default function PillList({ title, items, type }: PillListProps) {
  if (items.length === 0) return null;

  const config = {
    error: {
      bg: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
    },
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-[#0c0c0c]">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${style.iconColor}`} />
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {items.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`rounded-md border px-2.5 py-1 text-xs font-mono font-medium ${style.bg}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

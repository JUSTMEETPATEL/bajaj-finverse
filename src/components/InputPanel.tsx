"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface InputPanelProps {
  onSubmit: (data: string[]) => void;
  loading: boolean;
}

export default function InputPanel({ onSubmit, loading }: InputPanelProps) {
  const [input, setInput] = useState("");

  function handleSubmit() {
    const items = input
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length > 0) onSubmit(items);
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="edges" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Node Relationships
        </label>
      </div>
      <div className="relative group">
        <textarea
          id="edges"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. A->B, B->C, C->D&#10;Or one per line"
          rows={5}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 font-mono text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-zinc-600 dark:focus:bg-[#0c0c0c]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="hidden text-xs text-zinc-400 dark:text-zinc-500 sm:inline-block">
            Press <kbd className="rounded bg-zinc-200 px-1 font-sans text-[10px] dark:bg-zinc-800">⌘</kbd> <kbd className="rounded bg-zinc-200 px-1 font-sans text-[10px] dark:bg-zinc-800">↵</kbd>
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className={cn(
              "flex items-center justify-center rounded-lg p-2 transition-all",
              "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

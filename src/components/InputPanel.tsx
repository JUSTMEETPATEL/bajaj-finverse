"use client";

import { useState } from "react";

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
    <div className="w-full space-y-3">
      <label htmlFor="edges" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Enter node relationships
      </label>
      <textarea
        id="edges"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"A->B, B->C, C->D\nor one per line"}
        rows={5}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Processing..." : "Submit"}
      </button>
    </div>
  );
}

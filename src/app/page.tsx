"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import SummaryStrip from "@/components/SummaryStrip";
import HierarchyCard from "@/components/HierarchyCard";
import PillList from "@/components/PillList";

import type { NestedTree } from "@/utils/graph.utils";

interface BfhlResult {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: {
    root: string;
    tree?: NestedTree;
    depth?: number;
    has_cycle?: true;
  }[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export default function Home() {
  const [result, setResult] = useState<BfhlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: string[]) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Request failed with status ${res.status}`);
      }

      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          BFHL Graph Analyzer
        </h1>

        <InputPanel onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <SummaryStrip summary={result.summary} />

            <PillList title="Invalid Entries" items={result.invalid_entries} color="red" />
            <PillList title="Duplicate Edges" items={result.duplicate_edges} color="yellow" />

            {result.hierarchies.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Hierarchies
                </h2>
                {result.hierarchies.map((h) => (
                  <HierarchyCard key={h.root} hierarchy={h} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";
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
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12 font-sans text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Graph Analyzer
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Process complex node relationships, identify clusters, and detect structural cycles.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/50 p-1 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="rounded-xl bg-white p-6 dark:bg-[#0c0c0c]">
            <InputPanel onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-3 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
            >
              <Activity className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {loading && !result && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12 text-zinc-500"
            >
              <Loader2 className="h-6 w-6 animate-spin" />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <SummaryStrip summary={result.summary} />

              <div className="grid gap-4 sm:grid-cols-2">
                <PillList title="Invalid Entries" items={result.invalid_entries} type="error" />
                <PillList title="Duplicate Edges" items={result.duplicate_edges} type="warning" />
              </div>

              {result.hierarchies.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Hierarchies
                    </h2>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {result.hierarchies.length} found
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {result.hierarchies.map((h, i) => (
                      <motion.div
                        key={h.root}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <HierarchyCard hierarchy={h} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

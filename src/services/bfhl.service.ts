import { validateEdge } from "@/validators/node.validator";
import {
  UnionFind,
  detectCycle,
  buildTree,
  calcDepth,
  type NestedTree,
} from "@/utils/graph.utils";

export interface Hierarchy {
  root: string;
  tree?: NestedTree;
  depth?: number;
  has_cycle?: true;
}

export interface BfhlResult {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export function processBfhl(
  data: string[],
  userId: string,
  emailId: string,
  rollNumber: string
): BfhlResult {
  const invalidEntries: string[] = [];
  const duplicateEdges: string[] = [];
  const seen = new Set<string>();
  const validEdges: [string, string][] = [];

  for (const raw of data) {
    const { valid, trimmed } = validateEdge(raw);
    if (!valid) {
      invalidEntries.push(trimmed || raw);
      continue;
    }
    if (seen.has(trimmed)) {
      duplicateEdges.push(trimmed);
      continue;
    }
    seen.add(trimmed);
    const [src, dst] = trimmed.split("->");
    validEdges.push([src, dst]);
  }

  const children = new Map<string, Set<string>>();
  const parentCount = new Map<string, number>();
  const allNodes = new Set<string>();
  const uf = new UnionFind();

  for (const [src, dst] of validEdges) {
    allNodes.add(src);
    allNodes.add(dst);
    uf.union(src, dst);

    const currentParents = parentCount.get(dst) ?? 0;
    if (currentParents > 0) continue;

    parentCount.set(dst, currentParents + 1);
    if (!children.has(src)) children.set(src, new Set());
    children.get(src)!.add(dst);
  }

  const groups = new Map<string, Set<string>>();
  for (const node of allNodes) {
    const root = uf.find(node);
    if (!groups.has(root)) groups.set(root, new Set());
    groups.get(root)!.add(node);
  }

  const hierarchies: Hierarchy[] = [];

  for (const [, nodes] of groups) {
    const groupChildren = new Map<string, Set<string>>();
    for (const node of nodes) {
      if (children.has(node)) {
        const filtered = new Set<string>();
        for (const c of children.get(node)!) {
          if (nodes.has(c)) filtered.add(c);
        }
        if (filtered.size > 0) groupChildren.set(node, filtered);
      }
    }

    const roots = [...nodes].filter((n) => (parentCount.get(n) ?? 0) === 0);
    const hasCycle = detectCycle(groupChildren, nodes);

    if (hasCycle) {
      const root =
        roots.length > 0
          ? roots.sort()[0]
          : [...nodes].sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const root = roots.sort()[0];
      const tree = buildTree(root, groupChildren);
      const depth = calcDepth(root, groupChildren);
      hierarchies.push({ root, tree, depth });
    }
  }

  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  const trees = hierarchies.filter((h) => !h.has_cycle);
  const cycles = hierarchies.filter((h) => h.has_cycle);

  let largestTreeRoot = "";
  if (trees.length > 0) {
    let maxDepth = 0;
    for (const t of trees) {
      if (t.depth! > maxDepth) {
        maxDepth = t.depth!;
        largestTreeRoot = t.root;
      } else if (t.depth! === maxDepth && t.root < largestTreeRoot) {
        largestTreeRoot = t.root;
      }
    }
  }

  return {
    user_id: userId,
    email_id: emailId,
    college_roll_number: rollNumber,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: trees.length,
      total_cycles: cycles.length,
      largest_tree_root: largestTreeRoot,
    },
  };
}

export class UnionFind {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(a: string, b: string): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    const rankA = this.rank.get(ra)!;
    const rankB = this.rank.get(rb)!;
    if (rankA < rankB) {
      this.parent.set(ra, rb);
    } else if (rankA > rankB) {
      this.parent.set(rb, ra);
    } else {
      this.parent.set(rb, ra);
      this.rank.set(ra, rankA + 1);
    }
  }
}

export function detectCycle(
  children: Map<string, Set<string>>,
  nodes: Set<string>
): boolean {
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function dfs(node: string): boolean {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const child of children.get(node) ?? []) {
      if (dfs(child)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }

  for (const node of nodes) {
    if (dfs(node)) return true;
  }
  return false;
}

export type NestedTree = { [node: string]: NestedTree };

export function buildTree(
  root: string,
  children: Map<string, Set<string>>
): NestedTree {
  const result: NestedTree = {};
  const childSet = children.get(root);
  if (childSet) {
    for (const child of [...childSet].sort()) {
      result[child] = buildTree(child, children);
    }
  }
  return { [root]: result };
}

export function calcDepth(
  root: string,
  children: Map<string, Set<string>>
): number {
  let maxDepth = 1;

  function dfs(node: string, depth: number): void {
    if (depth > maxDepth) maxDepth = depth;
    for (const child of children.get(node) ?? []) {
      dfs(child, depth + 1);
    }
  }

  dfs(root, 1);
  return maxDepth;
}

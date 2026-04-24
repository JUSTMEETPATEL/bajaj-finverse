interface NestedTree {
  [node: string]: NestedTree;
}

interface HierarchyCardProps {
  hierarchy: {
    root: string;
    tree?: NestedTree;
    depth?: number;
    has_cycle?: true;
  };
}

function TreeNode({ tree, level }: { tree: NestedTree; level: number }) {
  return (
    <ul className={level > 0 ? "ml-4 border-l border-zinc-300 pl-3 dark:border-zinc-600" : ""}>
      {Object.entries(tree).map(([node, children]) => (
        <li key={node} className="py-0.5">
          <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">{node}</span>
          {Object.keys(children).length > 0 && (
            <TreeNode tree={children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function HierarchyCard({ hierarchy }: HierarchyCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Root: {hierarchy.root}
        </span>
        {hierarchy.has_cycle ? (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            CYCLE
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Depth: {hierarchy.depth}
          </span>
        )}
      </div>
      {!hierarchy.has_cycle && hierarchy.tree && (
        <TreeNode tree={hierarchy.tree} level={0} />
      )}
    </div>
  );
}

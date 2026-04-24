import { useMemo } from "react";
import { AlertCircle, Check } from "lucide-react";
import { 
  ReactFlow, 
  Background, 
  MarkerType, 
  Edge, 
  Node, 
  Position, 
  Handle 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

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

const CustomNode = ({ data }: { data: any }) => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-blue-500/80 bg-zinc-950 font-mono text-sm font-semibold text-blue-100 shadow-md transition-colors hover:bg-blue-900/30">
    <Handle type="target" position={Position.Top} className="opacity-0" />
    {data.label}
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </div>
);

const nodeTypes = { custom: CustomNode };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 40;
const nodeHeight = 40;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 60 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = { ...node };
    
    newNode.targetPosition = Position.Top;
    newNode.sourcePosition = Position.Bottom;

    newNode.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

function parseTreeToGraph(tree: NestedTree, parent: string | null = null, nodes: Node[] = [], edges: Edge[] = []): { nodes: Node[], edges: Edge[] } {
  for (const [nodeId, children] of Object.entries(tree)) {
    if (!nodes.find(n => n.id === nodeId)) {
      nodes.push({
        id: nodeId,
        type: 'custom',
        data: { label: nodeId },
        position: { x: 0, y: 0 },
      });
    }

    if (parent) {
      const edgeId = `${parent}->${nodeId}`;
      if (!edges.find(e => e.id === edgeId)) {
        edges.push({
          id: edgeId,
          source: parent,
          target: nodeId,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: '#64748b', // slate-500
          },
          style: {
            strokeWidth: 2,
            stroke: '#64748b',
          },
        });
      }
    }

    parseTreeToGraph(children, nodeId, nodes, edges);
  }
  return { nodes, edges };
}

export default function HierarchyCard({ hierarchy }: HierarchyCardProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!hierarchy.tree || hierarchy.has_cycle) return { nodes: [], edges: [] };
    
    // We add the root node first to ensure it's generated even if it has no children
    const nodes: Node[] = [{
      id: hierarchy.root,
      type: 'custom',
      data: { label: hierarchy.root },
      position: { x: 0, y: 0 },
    }];
    
    return parseTreeToGraph(hierarchy.tree, hierarchy.root, nodes, []);
  }, [hierarchy.tree, hierarchy.has_cycle, hierarchy.root]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges);
  }, [initialNodes, initialEdges]);

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-[#0c0c0c] col-span-full">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-[#111111]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 shadow-sm">
            <span className="font-mono text-sm font-bold text-emerald-500">{hierarchy.root}</span>
          </div>
          <div>
            <p className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Root: {hierarchy.root}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hierarchy.has_cycle ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Cycle Detected</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>Tree</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Depth: {hierarchy.depth}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative h-[600px] w-full bg-zinc-50 dark:bg-black/50">
        {!hierarchy.has_cycle && layoutedNodes.length > 0 ? (
          <ReactFlow 
            nodes={layoutedNodes} 
            edges={layoutedEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            className="w-full h-full"
            minZoom={0.1}
          >
            <Background color="#52525b" gap={16} />
          </ReactFlow>
        ) : hierarchy.has_cycle ? (
          <div className="flex h-full w-full items-center justify-center p-8">
            <div className="flex flex-col items-center gap-2 text-center text-red-600/80 dark:text-red-400/80">
              <AlertCircle className="h-8 w-8 opacity-50" />
              <p className="font-medium">
                Graph rendering disabled due to cyclic reference.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

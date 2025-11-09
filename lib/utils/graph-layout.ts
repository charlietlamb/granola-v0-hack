import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

const nodeWidth = 200;
const nodeHeight = 120;

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure the graph layout
  dagreGraph.setGraph({
    rankdir: direction, // TB = top to bottom, LR = left to right
    nodesep: 100, // Horizontal spacing between nodes in same rank
    ranksep: 50, // Spacing between ranks (columns for LR, rows for TB)
  });

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  // Apply the calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return layoutedNodes;
}

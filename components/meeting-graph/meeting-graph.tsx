"use client";

import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { SerializedMeeting } from "@/app/actions/meetings";
import MeetingNode from "./meeting-node";
import CustomEdge from "./custom-edge";
import { useMeetingGraph } from "./use-meeting-graph";

const nodeTypes = {
  meeting: MeetingNode,
};

const edgeTypes = {
  smoothstep: CustomEdge,
};

interface MeetingGraphProps {
  meetings: SerializedMeeting[];
}

export function MeetingGraph({ meetings }: MeetingGraphProps) {
  const { nodes, edges, onNodesChange, onEdgesChange } =
    useMeetingGraph(meetings);

  if (meetings.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] border border-border rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">
          No meetings to visualize
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] border border-border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={{ x: 100, y: 250, zoom: 1.0 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-background"
        />
        <Panel
          position="top-left"
          className="bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md border border-border"
        >
          <div className="text-xs text-muted-foreground">
            {nodes.length} meetings • {edges.length} connections
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

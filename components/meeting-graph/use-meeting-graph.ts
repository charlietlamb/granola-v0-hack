import {
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useMemo } from "react";
import type { SerializedMeeting } from "@/app/actions/meetings";
import { getLayoutedElements } from "@/lib/utils/graph-layout";

interface MeetingNodeData extends Record<string, unknown> {
  label: string;
  startTime: string;
  status: string;
  coachScore?: number;
  peopleCount: number;
}

function transformMeetingsToGraph(meetings: SerializedMeeting[]) {
  // Create nodes from meetings
  const nodes: Node<MeetingNodeData>[] = meetings.map((meeting) => ({
    id: meeting.id,
    type: "meeting",
    position: { x: 0, y: 0 }, // Will be set by layout algorithm
    data: {
      label: meeting.name,
      startTime: meeting.startTime,
      status: meeting.status,
      coachScore: meeting.coachScore,
      peopleCount: meeting.people.length,
    },
  }));

  // Create edges from nextConnectedMeetings relationships
  const edges: Edge[] = [];

  meetings.forEach((meeting) => {
    meeting.nextConnectedMeetings.forEach((nextId) => {
      edges.push({
        id: `e-${meeting.id}-${nextId}`,
        source: meeting.id,
        target: nextId,
        animated: meeting.status === "in_progress",
        type: "smoothstep",
      });
    });
  });

  return { nodes, edges };
}

export function useMeetingGraph(meetings: SerializedMeeting[]) {
  // Transform meetings to nodes and edges
  const { nodes: rawNodes, edges: rawEdges } = useMemo(
    () => transformMeetingsToGraph(meetings),
    [meetings],
  );

  // Apply layout algorithm to position nodes
  const layoutedNodes = useMemo(
    () => getLayoutedElements(rawNodes, rawEdges, "LR"),
    [rawNodes, rawEdges],
  );

  // Use React Flow state management
  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(rawEdges);

  return { nodes, edges, onNodesChange, onEdgesChange };
}

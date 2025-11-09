import {
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useMemo } from "react";
import { differenceInDays, differenceInHours, parseISO } from "date-fns";
import type { SerializedMeeting } from "@/app/actions/meetings";
import { getLayoutedElements } from "@/lib/utils/graph-layout";

interface MeetingNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  startTime: string;
  status: string;
  coachScore?: number;
  peopleCount: number;
}

interface EdgeData extends Record<string, unknown> {
  timeGap: string;
  coachScoreDelta?: number;
  actionItemCount: number;
  sourceStatus: string;
  targetStatus: string;
}

function calculateTimeGap(startTime: string, endTime: string): string {
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  const days = differenceInDays(end, start);
  const hours = differenceInHours(end, start);

  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return "same day";
  }
}

function getEdgeColor(sourceMeeting: SerializedMeeting, targetMeeting: SerializedMeeting): string {
  // Color based on coach score trend
  if (sourceMeeting.coachScore && targetMeeting.coachScore) {
    const delta = targetMeeting.coachScore - sourceMeeting.coachScore;
    if (delta > 0) return "#22c55e"; // Green - improving
    if (delta < 0) return "#ef4444"; // Red - declining
  }
  return "#94a3b8"; // Gray - no trend data
}

function getEdgeWidth(actionItemCount: number): number {
  // Thicker edges for more action items
  if (actionItemCount >= 5) return 3;
  if (actionItemCount >= 3) return 2.5;
  if (actionItemCount >= 1) return 2;
  return 1.5;
}

function transformMeetingsToGraph(meetings: SerializedMeeting[]) {
  // Create meeting lookup map
  const meetingMap = new Map(meetings.map(m => [m.id, m]));

  // Create nodes from meetings
  const nodes: Node<MeetingNodeData>[] = meetings.map((meeting) => ({
    id: meeting.id,
    type: "meeting",
    position: { x: 0, y: 0 }, // Will be set by layout algorithm
    data: {
      id: meeting.id,
      label: meeting.name,
      startTime: meeting.startTime,
      status: meeting.status,
      coachScore: meeting.coachScore,
      peopleCount: meeting.people.length,
    },
  }));

  // Create enhanced edges from nextConnectedMeetings relationships
  const edges: Edge[] = [];

  meetings.forEach((sourceMeeting) => {
    sourceMeeting.nextConnectedMeetings.forEach((nextId) => {
      const targetMeeting = meetingMap.get(nextId);
      if (!targetMeeting) return;

      // Calculate edge metrics
      const timeGap = calculateTimeGap(sourceMeeting.startTime, targetMeeting.startTime);
      const coachScoreDelta =
        sourceMeeting.coachScore && targetMeeting.coachScore
          ? targetMeeting.coachScore - sourceMeeting.coachScore
          : undefined;
      const actionItemCount = sourceMeeting.actionItems?.length || 0;

      // Determine animation
      const now = new Date();
      const targetDate = parseISO(targetMeeting.startTime);
      const hoursUntilTarget = differenceInHours(targetDate, now);

      let animated = false;
      let animationDuration = 1000;

      if (sourceMeeting.status === "in_progress" || targetMeeting.status === "in_progress") {
        animated = true;
        animationDuration = 800; // Fast pulse
      } else if (hoursUntilTarget > 0 && hoursUntilTarget <= 24) {
        animated = true;
        animationDuration = 1200; // Medium pulse for upcoming
      } else if (sourceMeeting.status === "completed" && targetMeeting.status === "completed") {
        animated = false; // No animation for historical
      }

      const edgeData: EdgeData = {
        timeGap,
        coachScoreDelta,
        actionItemCount,
        sourceStatus: sourceMeeting.status,
        targetStatus: targetMeeting.status,
      };

      // Create comprehensive label
      let labelParts: string[] = [];
      if (actionItemCount > 0) {
        labelParts.push(`${actionItemCount} actions`);
      }
      if (coachScoreDelta !== undefined) {
        const deltaStr = coachScoreDelta > 0 ? `+${coachScoreDelta}` : `${coachScoreDelta}`;
        labelParts.push(deltaStr);
      }
      if (labelParts.length === 0) {
        labelParts.push(timeGap);
      }

      edges.push({
        id: `e-${sourceMeeting.id}-${nextId}`,
        source: sourceMeeting.id,
        target: nextId,
        animated,
        type: "smoothstep",
        data: edgeData,
        style: {
          stroke: getEdgeColor(sourceMeeting, targetMeeting),
          strokeWidth: getEdgeWidth(actionItemCount),
        },
        label: labelParts.join(" • "),
        labelStyle: {
          fontSize: 10,
          fill: "#64748b",
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: "#ffffff",
          fillOpacity: 0.8,
        },
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

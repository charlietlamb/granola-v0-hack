import { Handle, type NodeProps, Position } from "@xyflow/react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface MeetingNodeData {
  id: string;
  label: string;
  startTime: string;
  status: string;
  coachScore?: number;
  peopleCount: number;
}

export default function MeetingNode({ data }: NodeProps) {
  const meetingData = data as unknown as MeetingNodeData;
  return (
    <Link
      href={`/meetings/${meetingData.id}`}
      className="block px-4 py-3 rounded-lg border-2 border-border bg-card shadow-md min-w-[180px] max-w-[220px] hover:border-primary transition-colors cursor-pointer"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary"
      />

      <div className="space-y-2">
        {/* Meeting Name */}
        <div className="font-medium text-sm leading-tight">
          {meetingData.label}
        </div>

        {/* Meeting Date */}
        <div className="text-xs text-muted-foreground">
          {format(parseISO(meetingData.startTime), "MMM d, yyyy")}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant={
              meetingData.status === "completed" ? "secondary" : "outline"
            }
            className="text-xs capitalize"
          >
            {meetingData.status}
          </Badge>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span>{meetingData.peopleCount} people</span>
          {meetingData.coachScore && (
            <>
              <span>•</span>
              <span>Score: {meetingData.coachScore}</span>
            </>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary"
      />
    </Link>
  );
}

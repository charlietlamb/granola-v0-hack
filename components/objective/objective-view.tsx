"use client";

import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import {
  getObjective,
  getObjectiveMeetings,
  type SerializedObjective,
} from "@/app/actions/objectives";
import type { SerializedMeeting } from "@/app/actions/meetings";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MeetingGraph } from "@/components/meeting-graph/meeting-graph";

interface ObjectiveViewProps {
  objectiveId: string;
}

function ObjectiveSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Skeleton className="h-8 w-64 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-8" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ObjectiveView({ objectiveId }: ObjectiveViewProps) {
  const {
    data: objective,
    isLoading: objectiveLoading,
    error: objectiveError,
  } = useQuery<SerializedObjective | null>({
    queryKey: ["objective", objectiveId],
    queryFn: () => getObjective(objectiveId),
  });

  const {
    data: meetings,
    isLoading: meetingsLoading,
    error: meetingsError,
  } = useQuery<SerializedMeeting[]>({
    queryKey: ["objective-meetings", objectiveId],
    queryFn: () => getObjectiveMeetings(objectiveId),
  });

  if (objectiveLoading || meetingsLoading) {
    return <ObjectiveSkeleton />;
  }

  if (objectiveError || meetingsError) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            Failed to load objective
          </p>
        </div>
      </div>
    );
  }

  if (!objective) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">Objective not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 py-8 pb-4">
        <h1 className="text-2xl font-semibold mb-2">{objective.name}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {objective.priority}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {objective.status.replace("_", " ")}
            </Badge>
          </div>
          {objective.dueDate && (
            <span>Due: {format(parseISO(objective.dueDate), "MMM d, yyyy")}</span>
          )}
          <span>Owner: {objective.owner.name}</span>
        </div>
      </div>

      {/* Meeting Relationships Graph - Full Width */}
      {meetings && meetings.length > 0 && (
        <div className="px-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Meeting Relationships
          </h2>
          <MeetingGraph meetings={meetings} />
        </div>
      )}

      {/* Meetings */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <h2 className="text-lg font-semibold mb-4">
          Related Meetings ({meetings?.length || 0})
        </h2>
        {!meetings || meetings.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No meetings found for this objective
          </div>
        ) : (
          <div className="space-y-2">
            {meetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer block"
              >
                <div>
                  <h3 className="text-sm font-medium">{meeting.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {meeting.people.length} people
                    {meeting.coachScore && ` • Score: ${meeting.coachScore}`}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(parseISO(meeting.startTime), "MMM d, yyyy HH:mm")}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

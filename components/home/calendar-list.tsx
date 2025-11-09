"use client";

import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { useMemo } from "react";
import { getMeetings, type SerializedMeeting } from "@/app/actions/meetings";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Group meetings by day
function groupMeetingsByDay(meetings: SerializedMeeting[]) {
  const grouped = new Map<string, SerializedMeeting[]>();

  for (const meeting of meetings) {
    const date = parseISO(meeting.startTime);
    const dayKey = format(date, "yyyy-MM-dd");

    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    grouped.get(dayKey)?.push(meeting);
  }

  // Sort meetings within each day by start time
  for (const meetings of grouped.values()) {
    meetings.sort(
      (a, b) =>
        parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime(),
    );
  }

  // Convert to array and sort by date
  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, meetings]) => ({ date, meetings }));
}

// Format day header
function formatDayHeader(dateString: string): string {
  const date = parseISO(dateString);

  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEEE"); // Just day name
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generate consistent color for person
function getPersonColor(index: number): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
  ];
  return colors[index % colors.length];
}

// Loading skeleton
function MeetingsSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="space-y-0">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-14 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CalendarList() {
  const {
    data: meetings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

  const groupedMeetings = useMemo(() => {
    if (!meetings) return [];
    return groupMeetingsByDay(meetings);
  }, [meetings]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold mb-8">Coach</h1>
        <MeetingsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold mb-8">Coach</h1>
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            Failed to load meetings
          </p>
        </div>
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold mb-8">Coach</h1>
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No meetings scheduled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold mb-8">Coach</h1>

      <div className="space-y-8">
        {groupedMeetings.map(({ date, meetings }) => (
          <div key={date} className="space-y-2">
            {/* Day Header */}
            <h2 className="text-xs font-medium text-muted-foreground mb-3 px-3">
              {formatDayHeader(date)}
            </h2>

            {/* Meetings for this day */}
            <div className="space-y-0">
              {meetings.map((meeting, index) => {
                const startTime = parseISO(meeting.startTime);
                const peopleCount = meeting.people.length;

                return (
                  <div
                    key={meeting.id}
                    className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/40 last:border-b-0"
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full ${getPersonColor(
                        index,
                      )} flex items-center justify-center text-white text-sm font-medium`}
                    >
                      {meeting.people[0]
                        ? getInitials(meeting.people[0].name)
                        : "M"}
                    </div>

                    {/* Meeting Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-normal text-foreground truncate">
                          {meeting.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0 h-5"
                        >
                          Notes
                        </Badge>
                        {peopleCount > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {peopleCount} people
                          </span>
                        )}
                        {meeting.coachScore && (
                          <span className="text-xs text-muted-foreground">
                            Score: {meeting.coachScore}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Time - Right aligned */}
                    <div className="shrink-0 text-xs text-muted-foreground">
                      {format(startTime, "dd/MM HH:mm")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

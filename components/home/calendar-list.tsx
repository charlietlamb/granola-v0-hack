"use client";

import { useQuery } from "@tanstack/react-query";
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  subWeeks,
} from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getMeetings, type SerializedMeeting } from "@/app/actions/meetings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const router = useRouter();

  const {
    data: meetings,
    isLoading: meetingsLoading,
    error: meetingsError,
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

  // Separate meetings into past and future
  const { futureMeetings, pastMeetings } = useMemo(() => {
    if (!meetings) return { futureMeetings: [], pastMeetings: [] };

    const now = new Date();
    const future: SerializedMeeting[] = [];
    const past: SerializedMeeting[] = [];

    meetings.forEach((meeting) => {
      const meetingDate = parseISO(meeting.startTime);
      if (meetingDate >= now) {
        future.push(meeting);
      } else {
        past.push(meeting);
      }
    });

    return {
      futureMeetings: future,
      pastMeetings: past,
    };
  }, [meetings]);

  const groupedFutureMeetings = useMemo(() => {
    return groupMeetingsByDay(futureMeetings);
  }, [futureMeetings]);

  const groupedPastMeetings = useMemo(() => {
    return groupMeetingsByDay(pastMeetings);
  }, [pastMeetings]);

  const isLoading = meetingsLoading;
  const error = meetingsError;

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            <MeetingsSkeleton />
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <MeetingsSkeleton />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">Failed to load meetings</p>
            </div>
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">Failed to load meetings</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold mb-6">Coach</h1>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">Upcoming (0)</TabsTrigger>
            <TabsTrigger value="past">Past (0)</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No upcoming meetings</p>
            </div>
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No past meetings</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Create a reusable function to render meetings
  const renderMeetings = (groupedMeetings: { date: string; meetings: SerializedMeeting[] }[], emptyMessage: string) => {
    if (groupedMeetings.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
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

                // For 1:1s, show the other person's initials (not Riley Chen)
                const displayPerson =
                  peopleCount === 2
                    ? meeting.people.find((p) => p.name !== "Riley Chen") ||
                      meeting.people[0]
                    : meeting.people[0];

                return (
                  <Link
                    key={meeting.id}
                    href={`/meetings/${meeting.id}`}
                    className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer last:border-b-0 block"
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full ${getPersonColor(
                        index,
                      )} flex items-center justify-center text-white text-sm font-medium`}
                    >
                      {displayPerson
                        ? getInitials(displayPerson.name)
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
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">
              Upcoming ({futureMeetings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastMeetings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {renderMeetings(groupedFutureMeetings, "No upcoming meetings")}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {renderMeetings(groupedPastMeetings, "No past meetings")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

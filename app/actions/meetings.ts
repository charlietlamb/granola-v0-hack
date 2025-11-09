"use server";

import { meetingStore } from "@/lib/stores";
import type { Meeting, Person } from "@/lib/types/meeting";

// Serialized person type for client (Dates as ISO strings)
export type SerializedPerson = Omit<Person, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Serialized meeting type for client (Dates as ISO strings)
export type SerializedMeeting = Omit<
  Meeting,
  "startTime" | "createdAt" | "updatedAt" | "agenda" | "notes" | "takeaways" | "people"
> & {
  startTime: string;
  createdAt: string;
  updatedAt: string;
  people: SerializedPerson[];
};

// Helper to convert Date or string to ISO string
function toISOString(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString();
}

export async function getMeetings(): Promise<SerializedMeeting[]> {
  try {
    const meetings = await meetingStore.getAll();

    // Serialize dates to ISO strings for client compatibility
    const serialized: SerializedMeeting[] = meetings.map((meeting) => ({
      ...meeting,
      startTime: toISOString(meeting.startTime),
      createdAt: toISOString(meeting.createdAt),
      updatedAt: toISOString(meeting.updatedAt),
      // Serialize Person dates in people array
      people: meeting.people.map((person) => ({
        ...person,
        createdAt: toISOString(person.createdAt),
        updatedAt: toISOString(person.updatedAt),
      })),
      // Remove nested objects that might have dates
      agenda: undefined,
      notes: undefined,
      takeaways: undefined,
    }));

    return serialized;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw new Error("Failed to fetch meetings");
  }
}

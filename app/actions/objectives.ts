"use server";

import { objectiveStore, meetingStore } from "@/lib/stores";
import type { Objective, Person, Meeting } from "@/lib/types/meeting";
import type { SerializedMeeting, SerializedPerson } from "./meetings";

// Serialized objective type for client (Dates as ISO strings)
export type SerializedObjective = Omit<
  Objective,
  "dueDate" | "createdAt" | "updatedAt" | "owner"
> & {
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  owner: SerializedPerson;
};

// Helper to convert Date or string to ISO string
function toISOString(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString();
}

export async function getObjective(
  objectiveId: string,
): Promise<SerializedObjective | null> {
  try {
    const objective = await objectiveStore.get(objectiveId);
    if (!objective) return null;

    // Serialize dates to ISO strings for client compatibility
    return {
      ...objective,
      dueDate: objective.dueDate
        ? toISOString(objective.dueDate)
        : undefined,
      createdAt: toISOString(objective.createdAt),
      updatedAt: toISOString(objective.updatedAt),
      owner: {
        ...objective.owner,
        createdAt: toISOString(objective.owner.createdAt),
        updatedAt: toISOString(objective.owner.updatedAt),
      },
    };
  } catch (error) {
    console.error("Error fetching objective:", error);
    throw new Error("Failed to fetch objective");
  }
}

export async function getObjectiveMeetings(
  objectiveId: string,
): Promise<SerializedMeeting[]> {
  try {
    const allMeetings = await meetingStore.getAll();

    // Filter meetings by objectiveId
    const objectiveMeetings = allMeetings.filter(
      (meeting) => meeting.objectiveId === objectiveId,
    );

    // Serialize dates to ISO strings for client compatibility
    const serialized: SerializedMeeting[] = objectiveMeetings.map(
      (meeting) => ({
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
      }),
    );

    return serialized;
  } catch (error) {
    console.error("Error fetching objective meetings:", error);
    throw new Error("Failed to fetch objective meetings");
  }
}

"use server";

import {
  meetingStore,
  personStore,
  objectiveStore,
  agendaStore,
  actionItemStore,
  meetingNoteStore,
} from "@/lib/stores";
import type {
  Meeting,
  Person,
  Objective,
  Agenda,
  ActionItem,
  MeetingNote,
} from "@/lib/types/meeting";

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

// Serialized types for meeting detail
export type SerializedAgenda = Omit<Agenda, "createdAt"> & {
  createdAt: string;
};

export type SerializedActionItem = Omit<
  ActionItem,
  "createdAt" | "updatedAt" | "dueDate" | "completedAt" | "assignedTo"
> & {
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  completedAt: string | null;
  assignedTo: SerializedPerson;
};

export type SerializedMeetingNote = Omit<MeetingNote, "createdAt"> & {
  createdAt: string;
};

export type SerializedObjective = Omit<
  Objective,
  "createdAt" | "updatedAt" | "dueDate" | "owner"
> & {
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  owner: SerializedPerson;
};

export type MeetingDetail = {
  meeting: SerializedMeeting;
  people: SerializedPerson[];
  objective: SerializedObjective | null;
  agenda: SerializedAgenda | null;
  actionItems: SerializedActionItem[];
  notes: SerializedMeetingNote | null;
  previousMeetings: SerializedMeeting[];
  nextMeetings: SerializedMeeting[];
  preparationInfo?: string; // AI-generated preparation info
};

// Helper to convert Date or string to ISO string
function toISOString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  if (typeof date === "string") return date;
  return date.toISOString();
}

export async function getMeetings(): Promise<SerializedMeeting[]> {
  try {
    const meetings = await meetingStore.getAll();

    // Serialize dates to ISO strings for client compatibility
    const serialized: SerializedMeeting[] = meetings.map((meeting) => ({
      ...meeting,
      startTime: toISOString(meeting.startTime)!,
      createdAt: toISOString(meeting.createdAt)!,
      updatedAt: toISOString(meeting.updatedAt)!,
      // Serialize Person dates in people array
      people: meeting.people.map((person) => ({
        ...person,
        createdAt: toISOString(person.createdAt)!,
        updatedAt: toISOString(person.updatedAt)!,
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

export async function getMeetingDetail(id: string): Promise<MeetingDetail | null> {
  try {
    const meeting = await meetingStore.get(id);
    if (!meeting) return null;

    // Resolve all related data
    const [objective, agenda, notes, allActionItems] = await Promise.all([
      meeting.objectiveId ? objectiveStore.get(meeting.objectiveId) : null,
      agendaStore.getByMeetingId(id),
      meetingNoteStore.getByMeetingId(id),
      actionItemStore.getByMeetingId(id),
    ]);

    // Resolve people from action items
    const actionItemPeopleIds = new Set(
      allActionItems.map((item) => item.assignedTo.id),
    );
    const actionItemPeople = await Promise.all(
      Array.from(actionItemPeopleIds).map((personId) => personStore.get(personId)),
    );

    // Resolve connected meetings
    const [previousMeetings, nextMeetings] = await Promise.all([
      Promise.all(
        meeting.previousConnectedMeetings.map((meetingId) =>
          meetingStore.get(meetingId),
        ),
      ),
      Promise.all(
        meeting.nextConnectedMeetings.map((meetingId) =>
          meetingStore.get(meetingId),
        ),
      ),
    ]);

    // Serialize everything
    const serializedMeeting: SerializedMeeting = {
      ...meeting,
      startTime: toISOString(meeting.startTime)!,
      createdAt: toISOString(meeting.createdAt)!,
      updatedAt: toISOString(meeting.updatedAt)!,
      people: meeting.people.map((person) => ({
        ...person,
        createdAt: toISOString(person.createdAt)!,
        updatedAt: toISOString(person.updatedAt)!,
      })),
      agenda: undefined,
      notes: undefined,
      takeaways: undefined,
    };

    const serializedObjective: SerializedObjective | null = objective
      ? {
          ...objective,
          createdAt: toISOString(objective.createdAt)!,
          updatedAt: toISOString(objective.updatedAt)!,
          dueDate: toISOString(objective.dueDate),
          owner: {
            ...objective.owner,
            createdAt: toISOString(objective.owner.createdAt)!,
            updatedAt: toISOString(objective.owner.updatedAt)!,
          },
        }
      : null;

    const serializedAgenda: SerializedAgenda | null = agenda
      ? {
          ...agenda,
          createdAt: toISOString(agenda.createdAt)!,
        }
      : null;

    const serializedNotes: SerializedMeetingNote | null = notes
      ? {
          ...notes,
          createdAt: toISOString(notes.createdAt)!,
        }
      : null;

    const serializedActionItems: SerializedActionItem[] = allActionItems.map(
      (item) => {
        const assignedTo = item.assignedTo;
        return {
          ...item,
          createdAt: toISOString(item.createdAt)!,
          updatedAt: toISOString(item.updatedAt)!,
          dueDate: toISOString(item.dueDate),
          completedAt: toISOString(item.completedAt),
          assignedTo: {
            ...assignedTo,
            createdAt: toISOString(assignedTo.createdAt)!,
            updatedAt: toISOString(assignedTo.updatedAt)!,
          },
        };
      },
    );

    const serializedPreviousMeetings: SerializedMeeting[] = previousMeetings
      .filter((m): m is Meeting => m !== null)
      .map((m) => ({
        ...m,
        startTime: toISOString(m.startTime)!,
        createdAt: toISOString(m.createdAt)!,
        updatedAt: toISOString(m.updatedAt)!,
        people: m.people.map((person) => ({
          ...person,
          createdAt: toISOString(person.createdAt)!,
          updatedAt: toISOString(person.updatedAt)!,
        })),
        agenda: undefined,
        notes: undefined,
        takeaways: undefined,
      }));

    const serializedNextMeetings: SerializedMeeting[] = nextMeetings
      .filter((m): m is Meeting => m !== null)
      .map((m) => ({
        ...m,
        startTime: toISOString(m.startTime)!,
        createdAt: toISOString(m.createdAt)!,
        updatedAt: toISOString(m.updatedAt)!,
        people: m.people.map((person) => ({
          ...person,
          createdAt: toISOString(person.createdAt)!,
          updatedAt: toISOString(person.updatedAt)!,
        })),
        agenda: undefined,
        notes: undefined,
        takeaways: undefined,
      }));

    // Generate preparation info (placeholder - would be AI-generated in real app)
    const preparationInfo =
      objective && previousMeetings.filter((m) => m !== null).length > 0
        ? `Based on previous meetings for "${objective.name}", review the following key points before this meeting.`
        : undefined;

    return {
      meeting: serializedMeeting,
      people: meeting.people.map((person) => ({
        ...person,
        createdAt: toISOString(person.createdAt)!,
        updatedAt: toISOString(person.updatedAt)!,
      })),
      objective: serializedObjective,
      agenda: serializedAgenda,
      actionItems: serializedActionItems,
      notes: serializedNotes,
      previousMeetings: serializedPreviousMeetings,
      nextMeetings: serializedNextMeetings,
      preparationInfo,
    };
  } catch (error) {
    console.error("Error fetching meeting detail:", error);
    throw new Error("Failed to fetch meeting detail");
  }
}

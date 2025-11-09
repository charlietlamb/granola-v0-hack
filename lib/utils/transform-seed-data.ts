import * as fs from "fs";
import * as path from "path";
import type {
  ActionItem,
  Agenda,
  Meeting,
  MeetingNote,
  Objective,
  Person,
  Takeaways,
} from "@/lib/types/meeting";

// JSON data structure interfaces
interface JSONPerson {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface JSONObjective {
  id: string;
  name: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

interface JSONAgendaTemplate {
  id: string;
  title: string;
  items: string[];
  goal: string;
  createdAt: string;
  updatedAt: string;
}

interface JSONMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  participants: string[];
  objectiveId?: string;
  agendaId?: string;
  ai_summary?: string;
  coach_score?: number;
  coach_feedback?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  location?: string;
  transcript_url?: string;
  previousConnectedMeetings: string[];
  nextConnectedMeetings: string[];
  createdAt: string;
  updatedAt: string;
}

interface JSONMeetingNote {
  id: string;
  meetingId: string;
  content: string;
  createdAt: string;
}

interface JSONTakeaway {
  id: string;
  meetingId: string;
  content: string;
  createdAt: string;
}

interface JSONActionItem {
  id: string;
  item: string;
  meetingId: string;
  objectiveId?: string;
  status: "not_started" | "in_progress" | "completed" | "blocked" | "scheduled";
  assignee: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface JSONData {
  persons: JSONPerson[];
  objectives: JSONObjective[];
  agendas: JSONAgendaTemplate[];
  meetings: JSONMeeting[];
  meetingNotes: JSONMeetingNote[];
  takeaways: JSONTakeaway[];
  actionItems: JSONActionItem[];
}

// Helper functions
function parseDate(isoString: string): Date {
  return new Date(isoString);
}

function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.floor((end - start) / 1000); // Convert to seconds
}

function createAgendaFromTemplate(
  meetingId: string,
  agendaTemplate: JSONAgendaTemplate,
  actionItemIds: string[],
): Agenda {
  const agendaText = `${agendaTemplate.title}\n\nGoal: ${agendaTemplate.goal}\n\n${agendaTemplate.items.map((item, i) => `${i + 1}. ${item}`).join("\n")}`;

  return {
    id: agendaTemplate.id,
    meetingId,
    agenda: agendaText,
    actionItems: actionItemIds,
    createdAt: parseDate(agendaTemplate.createdAt),
  };
}

// Transform functions
export function transformSeedData() {
  // Read the JSON file
  const jsonPath = path.join(process.cwd(), "meeting-data-2.json");
  const jsonContent = fs.readFileSync(jsonPath, "utf-8");
  const data: JSONData = JSON.parse(jsonContent);

  console.log("📊 Transforming seed data...");
  console.log(`  Persons: ${data.persons.length}`);
  console.log(`  Objectives: ${data.objectives.length}`);
  console.log(`  Meetings: ${data.meetings.length}`);
  console.log(`  Action Items: ${data.actionItems.length}`);
  console.log(`  Meeting Notes: ${data.meetingNotes.length}`);
  console.log(`  Takeaways: ${data.takeaways.length}`);
  console.log(`  Agenda Templates: ${data.agendas.length}`);

  // Create lookup maps for efficient access
  const personsMap = new Map<string, Person>();
  const agendaTemplatesMap = new Map<string, JSONAgendaTemplate>();
  const actionItemsByMeetingMap = new Map<string, string[]>();
  const meetingNotesByMeetingMap = new Map<string, JSONMeetingNote>();
  const takeawaysByMeetingMap = new Map<string, JSONTakeaway>();

  // 1. Transform Persons (no dependencies)
  const persons: Person[] = data.persons.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    createdAt: parseDate(p.createdAt),
    updatedAt: parseDate(p.updatedAt),
  }));

  // Build persons map
  persons.forEach((p) => personsMap.set(p.id, p));

  // Build agenda templates map
  data.agendas.forEach((a) => agendaTemplatesMap.set(a.id, a));

  // Build action items by meeting map
  data.actionItems.forEach((ai) => {
    if (!actionItemsByMeetingMap.has(ai.meetingId)) {
      actionItemsByMeetingMap.set(ai.meetingId, []);
    }
    actionItemsByMeetingMap.get(ai.meetingId)!.push(ai.id);
  });

  // Build meeting notes map
  data.meetingNotes.forEach((mn) => {
    meetingNotesByMeetingMap.set(mn.meetingId, mn);
  });

  // Build takeaways map
  data.takeaways.forEach((t) => {
    takeawaysByMeetingMap.set(t.meetingId, t);
  });

  // 2. Transform Action Items (depends on Persons)
  const actionItems: ActionItem[] = data.actionItems.map((ai) => {
    const assignedTo = personsMap.get(ai.assignee);
    if (!assignedTo) {
      throw new Error(
        `Person not found for action item assignee: ${ai.assignee}`,
      );
    }

    // Map "scheduled" to "not_started" since Zod schema only supports not_started/in_progress/completed/blocked
    const status = ai.status === "scheduled" ? "not_started" : ai.status;

    return {
      id: ai.id,
      item: ai.item,
      meetingId: ai.meetingId,
      objectiveId: ai.objectiveId,
      status,
      priority: "medium", // Default priority
      assignedTo,
      dueDate: ai.dueDate ? parseDate(ai.dueDate) : undefined,
      completedAt:
        ai.status === "completed" ? parseDate(ai.updatedAt) : undefined,
      createdAt: parseDate(ai.createdAt),
      updatedAt: parseDate(ai.updatedAt),
    };
  });

  // 3. Transform Meeting Notes
  const meetingNotes: MeetingNote[] = data.meetingNotes.map((mn) => ({
    id: mn.id,
    meetingId: mn.meetingId,
    rawTranscript: mn.content,
    aiSummary: mn.content,
    actionItems: actionItemsByMeetingMap.get(mn.meetingId) || [],
    createdAt: parseDate(mn.createdAt),
  }));

  // 4. Transform Takeaways
  const takeaways: Takeaways[] = data.takeaways.map((t) => ({
    id: t.id,
    meetingId: t.meetingId,
    content: t.content,
    createdAt: parseDate(t.createdAt),
  }));

  // 5. Transform Meetings (depends on many things)
  const meetings: Meeting[] = [];
  const agendasMap = new Map<string, Agenda>();

  data.meetings.forEach((m) => {
    // Look up participants
    const people: Person[] = m.participants
      .map((participantId) => personsMap.get(participantId))
      .filter((p): p is Person => p !== undefined);

    if (people.length !== m.participants.length) {
      console.warn(`Warning: Some participants not found for meeting ${m.id}`);
    }

    // Create agenda from template if available
    let agenda: Agenda | undefined;
    if (m.agendaId) {
      const template = agendaTemplatesMap.get(m.agendaId);
      if (template) {
        const meetingActionItems = actionItemsByMeetingMap.get(m.id) || [];
        agenda = createAgendaFromTemplate(m.id, template, meetingActionItems);
        agendasMap.set(agenda.id, agenda);
      }
    }

    // Look up notes
    const noteData = meetingNotesByMeetingMap.get(m.id);
    const notes: MeetingNote | undefined = noteData
      ? {
          id: noteData.id,
          meetingId: noteData.meetingId,
          rawTranscript: noteData.content,
          aiSummary: noteData.content,
          actionItems: actionItemsByMeetingMap.get(m.id) || [],
          createdAt: parseDate(noteData.createdAt),
        }
      : undefined;

    // Look up takeaways
    const takeawayData = takeawaysByMeetingMap.get(m.id);
    const meetingTakeaways: Takeaways | undefined = takeawayData
      ? {
          id: takeawayData.id,
          meetingId: takeawayData.meetingId,
          content: takeawayData.content,
          createdAt: parseDate(takeawayData.createdAt),
        }
      : undefined;

    const meeting: Meeting = {
      id: m.id,
      name: m.title,
      aiSummary: m.ai_summary,
      googleCalendarId: undefined, // Not in source data
      startTime: parseDate(m.startTime),
      duration: calculateDuration(m.startTime, m.endTime),
      people,
      agenda,
      notes,
      takeaways: meetingTakeaways,
      actionItems: actionItemsByMeetingMap.get(m.id) || [],
      coachScore: m.coach_score ?? undefined, // Convert null to undefined
      coachFeedback: m.coach_feedback ?? undefined, // Convert null to undefined
      previousConnectedMeetings: m.previousConnectedMeetings,
      nextConnectedMeetings: m.nextConnectedMeetings,
      status: m.status,
      objectiveId: m.objectiveId,
      createdAt: parseDate(m.createdAt),
      updatedAt: parseDate(m.updatedAt),
    };

    meetings.push(meeting);
  });

  // 6. Transform Objectives (depends on Persons and Meetings)
  const objectives: Objective[] = data.objectives.map((obj) => {
    // Find all meetings for this objective
    const objectiveMeetings = meetings
      .filter((m) => m.objectiveId === obj.id)
      .map((m) => m.id);

    // Assign Riley Chen as the owner (first person in the list)
    const owner = personsMap.get(data.persons[0].id);
    if (!owner) {
      throw new Error("Riley Chen not found in persons");
    }

    // Map "critical" to "high" since Zod schema only supports low/medium/high
    const priority = obj.priority === "critical" ? "high" : obj.priority;

    return {
      id: obj.id,
      name: obj.name,
      dueDate: obj.dueDate ? parseDate(obj.dueDate) : undefined,
      meetings: objectiveMeetings,
      knowledgeBase: undefined,
      status: "in_progress" as const,
      priority,
      owner,
      createdAt: parseDate(obj.createdAt),
      updatedAt: parseDate(obj.updatedAt),
    };
  });

  // Convert agendas map to array
  const agendas = Array.from(agendasMap.values());

  console.log("✅ Transformation complete!");
  console.log(`  Transformed ${persons.length} persons`);
  console.log(`  Transformed ${objectives.length} objectives`);
  console.log(`  Transformed ${agendas.length} agendas`);
  console.log(`  Transformed ${meetings.length} meetings`);
  console.log(`  Transformed ${actionItems.length} action items`);
  console.log(`  Transformed ${meetingNotes.length} meeting notes`);
  console.log(`  Transformed ${takeaways.length} takeaways`);

  return {
    persons,
    objectives,
    agendas,
    meetings,
    actionItems,
    meetingNotes,
    takeaways,
  };
}

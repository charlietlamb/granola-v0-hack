import type {
  Person,
  Objective,
  Meeting,
  ActionItem,
  Agenda,
  MeetingNote,
  Takeaways,
} from "@/lib/types/meeting";
import { transformSeedData } from "@/lib/utils/transform-seed-data";

// Transform the JSON data
const transformedData = transformSeedData();

// Export transformed data
export const seedPeople: Person[] = transformedData.persons;
export const seedObjectives: Objective[] = transformedData.objectives;
export const seedAgendas: Agenda[] = transformedData.agendas;
export const seedMeetings: Meeting[] = transformedData.meetings;
export const seedActionItems: ActionItem[] = transformedData.actionItems;
export const seedMeetingNotes: MeetingNote[] = transformedData.meetingNotes;
export const seedTakeaways: Takeaways[] = transformedData.takeaways;

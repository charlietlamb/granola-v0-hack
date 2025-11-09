import { z } from "zod";

// Person schema
export const personSchema = z.object({
  id: z.uuid("Invalid person ID"),
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Objective schema
export const objectiveSchema = z.object({
  id: z.uuid("Invalid objective ID"),
  name: z.string().min(1, "Objective name is required"),
  dueDate: z.date().optional(),
  meetings: z.array(z.uuid("Invalid meeting ID")).default([]),
  knowledgeBase: z.string().optional(),
  status: z.enum(["not_started", "in_progress", "completed", "blocked"]).default("not_started"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  owner: personSchema,
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Agenda schema
export const agendaSchema = z.object({
  id: z.uuid("Invalid agenda ID"),
  meetingId: z.uuid("Invalid meeting ID"),
  agenda: z.string(),
  actionItems: z.array(z.uuid("Invalid action item ID")).default([]),
  createdAt: z.date().default(() => new Date()),
});

// MeetingNote schema
export const meetingNoteSchema = z.object({
  id: z.uuid("Invalid meeting note ID"),
  meetingId: z.uuid("Invalid meeting ID"),
  rawTranscript: z.string(),
  aiSummary: z.string(),
  actionItems: z.array(z.uuid("Invalid action item ID")).default([]),
  createdAt: z.date().default(() => new Date()),
});

// Takeaways schema
export const takeawaysSchema = z.object({
  id: z.uuid("Invalid takeaways ID"),
  meetingId: z.uuid("Invalid meeting ID"),
  content: z.string(),
  createdAt: z.date().default(() => new Date()),
});

// Action Item schema
export const actionItemSchema = z.object({
  id: z.uuid("Invalid action item ID"),
  item: z.string().min(1, "Action item description is required"),
  meetingId: z.uuid("Invalid meeting ID"),
  objectiveId: z.uuid("Invalid objective ID").optional(),
  status: z.enum(["not_started", "in_progress", "completed", "blocked"]).default("not_started"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assignedTo: personSchema,
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Meeting schema
export const meetingSchema = z.object({
  id: z.uuid("Invalid meeting ID"),
  name: z.string().min(1, "Meeting name is required"),
  aiSummary: z.string().optional(),
  googleCalendarId: z.string().optional(),
  startTime: z.date(),
  duration: z.number().int().positive("Duration must be positive"), // in seconds
  people: z.array(personSchema).default([]),
  agenda: agendaSchema.optional(),
  notes: meetingNoteSchema.optional(),
  takeaways: takeawaysSchema.optional(),
  actionItems: z.array(z.uuid("Invalid action item ID")).default([]),
  coachScore: z.number().int().min(0).max(100).optional(),
  coachFeedback: z.string().optional(),
  previousConnectedMeetings: z.array(z.uuid("Invalid meeting ID")).default([]),
  nextConnectedMeetings: z.array(z.uuid("Invalid meeting ID")).default([]),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled"),
  objectiveId: z.uuid("Invalid objective ID").optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Inferred TypeScript types
export type Person = z.infer<typeof personSchema>;
export type Objective = z.infer<typeof objectiveSchema>;
export type Agenda = z.infer<typeof agendaSchema>;
export type MeetingNote = z.infer<typeof meetingNoteSchema>;
export type Takeaways = z.infer<typeof takeawaysSchema>;
export type ActionItem = z.infer<typeof actionItemSchema>;
export type Meeting = z.infer<typeof meetingSchema>;

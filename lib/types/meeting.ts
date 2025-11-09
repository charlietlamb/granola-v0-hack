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
  title: z.string().min(1, "Objective title is required"),
  description: z.string().optional(),
  progress: z.number().min(0).max(100).default(0), // percentage 0-100
  status: z.enum(["not_started", "in_progress", "completed", "blocked"]).default("not_started"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  owner: personSchema,
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
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

// Attendee schema (for meeting participants)
export const attendeeSchema = z.object({
  personId: z.uuid("Invalid person ID"),
  status: z.enum(["accepted", "declined", "tentative", "no_response"]).default("no_response"),
  required: z.boolean().default(true),
});

// Meeting schema
export const meetingSchema = z.object({
  id: z.uuid("Invalid meeting ID"),
  summary: z.string().min(1, "Meeting summary is required"),
  description: z.string().optional(),
  attendees: z.array(attendeeSchema).min(1, "At least one attendee is required"),
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number().positive("Duration must be positive"), // in minutes
  notes: z.string().optional(),
  actionItems: z.array(z.uuid("Invalid action item ID")).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

// Inferred TypeScript types
export type Person = z.infer<typeof personSchema>;
export type Objective = z.infer<typeof objectiveSchema>;
export type ActionItem = z.infer<typeof actionItemSchema>;
export type Attendee = z.infer<typeof attendeeSchema>;
export type Meeting = z.infer<typeof meetingSchema>;

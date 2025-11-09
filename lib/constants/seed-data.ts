import type {
  Person,
  Objective,
  Meeting,
  ActionItem,
  Agenda,
  MeetingNote,
  Takeaways,
} from "@/lib/types/meeting";

// Generate UUIDs
const personIds = {
  alice: crypto.randomUUID(),
  bob: crypto.randomUUID(),
  charlie: crypto.randomUUID(),
  diana: crypto.randomUUID(),
};

const objectiveIds = {
  q1Growth: crypto.randomUUID(),
  productLaunch: crypto.randomUUID(),
};

const meetingIds = {
  standup1: crypto.randomUUID(),
  planning: crypto.randomUUID(),
  retrospective: crypto.randomUUID(),
  oneOnOne: crypto.randomUUID(),
};

const actionItemIds = {
  ai1: crypto.randomUUID(),
  ai2: crypto.randomUUID(),
  ai3: crypto.randomUUID(),
  ai4: crypto.randomUUID(),
  ai5: crypto.randomUUID(),
  ai6: crypto.randomUUID(),
};

const agendaIds = {
  agenda1: crypto.randomUUID(),
  agenda2: crypto.randomUUID(),
  agenda3: crypto.randomUUID(),
};

const noteIds = {
  note1: crypto.randomUUID(),
  note2: crypto.randomUUID(),
  note3: crypto.randomUUID(),
};

const takeawayIds = {
  takeaway1: crypto.randomUUID(),
  takeaway2: crypto.randomUUID(),
  takeaway3: crypto.randomUUID(),
};

// People
export const seedPeople: Person[] = [
  {
    id: personIds.alice,
    name: "Alice Johnson",
    email: "alice@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.bob,
    name: "Bob Smith",
    email: "bob@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.charlie,
    name: "Charlie Davis",
    email: "charlie@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.diana,
    name: "Diana Martinez",
    email: "diana@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Objectives
export const seedObjectives: Objective[] = [
  {
    id: objectiveIds.q1Growth,
    name: "Q1 Revenue Growth - 20% Increase",
    dueDate: new Date("2024-03-31"),
    meetings: [meetingIds.planning, meetingIds.retrospective],
    knowledgeBase: "https://company.com/docs/q1-objectives",
    status: "in_progress",
    priority: "high",
    owner: seedPeople[0], // Alice
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: objectiveIds.productLaunch,
    name: "Launch Mobile App V2",
    dueDate: new Date("2024-04-15"),
    meetings: [meetingIds.standup1, meetingIds.oneOnOne],
    knowledgeBase: "https://company.com/docs/mobile-v2",
    status: "in_progress",
    priority: "high",
    owner: seedPeople[1], // Bob
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
  },
];

// Agendas
export const seedAgendas: Agenda[] = [
  {
    id: agendaIds.agenda1,
    meetingId: meetingIds.standup1,
    agenda: "1. Sprint progress review\n2. Blocker discussion\n3. Today's priorities",
    actionItems: [actionItemIds.ai1, actionItemIds.ai2],
    createdAt: new Date("2024-01-15T08:00:00Z"),
  },
  {
    id: agendaIds.agenda2,
    meetingId: meetingIds.planning,
    agenda: "1. Q1 goals overview\n2. Resource allocation\n3. Timeline review\n4. Risk assessment",
    actionItems: [actionItemIds.ai3, actionItemIds.ai4],
    createdAt: new Date("2024-01-10T13:00:00Z"),
  },
  {
    id: agendaIds.agenda3,
    meetingId: meetingIds.retrospective,
    agenda: "1. What went well\n2. What could be improved\n3. Action items for next sprint",
    actionItems: [actionItemIds.ai5, actionItemIds.ai6],
    createdAt: new Date("2024-01-20T14:00:00Z"),
  },
];

// Meeting Notes
export const seedMeetingNotes: MeetingNote[] = [
  {
    id: noteIds.note1,
    meetingId: meetingIds.standup1,
    rawTranscript: "Alice: Good morning team. Let's start with sprint progress...\nBob: We completed the API integration yesterday...\nCharlie: Working on the UI components, should be done by EOD...",
    aiSummary: "Team discussed sprint progress. API integration is complete. UI components are on track for end of day completion. No major blockers reported.",
    actionItems: [actionItemIds.ai1, actionItemIds.ai2],
    createdAt: new Date("2024-01-15T09:30:00Z"),
  },
  {
    id: noteIds.note2,
    meetingId: meetingIds.planning,
    rawTranscript: "Alice: Let's review our Q1 objectives...\nDiana: I've prepared the resource allocation sheet...\nBob: Timeline looks aggressive but achievable...",
    aiSummary: "Q1 planning session covered objectives, resource allocation, and timeline. Team identified potential risks and mitigation strategies. Overall consensus that timeline is challenging but feasible with proper resource allocation.",
    actionItems: [actionItemIds.ai3, actionItemIds.ai4],
    createdAt: new Date("2024-01-10T15:00:00Z"),
  },
  {
    id: noteIds.note3,
    meetingId: meetingIds.retrospective,
    rawTranscript: "Charlie: Communication was much better this sprint...\nBob: We should improve our testing process...\nAlice: Agreed, let's implement automated testing...",
    aiSummary: "Retrospective highlighted improved team communication as a major win. Testing process identified as area for improvement. Team agreed to implement automated testing and increase code review thoroughness.",
    actionItems: [actionItemIds.ai5, actionItemIds.ai6],
    createdAt: new Date("2024-01-20T15:30:00Z"),
  },
];

// Takeaways
export const seedTakeaways: Takeaways[] = [
  {
    id: takeawayIds.takeaway1,
    meetingId: meetingIds.standup1,
    content: "Sprint is on track. No blockers. Focus on UI completion today.",
    createdAt: new Date("2024-01-15T09:30:00Z"),
  },
  {
    id: takeawayIds.takeaway2,
    meetingId: meetingIds.planning,
    content: "Q1 targets are ambitious but achievable. Resource allocation approved. Need to monitor timeline closely and adjust if needed.",
    createdAt: new Date("2024-01-10T15:00:00Z"),
  },
  {
    id: takeawayIds.takeaway3,
    meetingId: meetingIds.retrospective,
    content: "Communication improvements working well. Automated testing is our next big improvement. Continue weekly retrospectives.",
    createdAt: new Date("2024-01-20T15:30:00Z"),
  },
];

// Meetings
export const seedMeetings: Meeting[] = [
  {
    id: meetingIds.standup1,
    name: "Daily Standup - Jan 15",
    aiSummary: "Quick sync on sprint progress. All team members reported being on track with their tasks. No blockers identified.",
    googleCalendarId: "evt_standup_jan15_2024",
    startTime: new Date("2024-01-15T09:00:00Z"),
    duration: 900, // 15 minutes
    people: [seedPeople[0], seedPeople[1], seedPeople[2]], // Alice, Bob, Charlie
    agenda: seedAgendas[0],
    notes: seedMeetingNotes[0],
    takeaways: seedTakeaways[0],
    actionItems: [actionItemIds.ai1, actionItemIds.ai2],
    coachScore: 85,
    coachFeedback: "Good time management. Meeting ended on schedule. Consider adding more specific metrics to status updates.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "completed",
    objectiveId: objectiveIds.productLaunch,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-15T09:30:00Z"),
  },
  {
    id: meetingIds.planning,
    name: "Q1 Planning Session",
    aiSummary: "Comprehensive planning for Q1 objectives. Team aligned on goals, timelines, and resource needs. Identified key milestones and potential risks.",
    googleCalendarId: "evt_planning_q1_2024",
    startTime: new Date("2024-01-10T14:00:00Z"),
    duration: 3600, // 1 hour
    people: seedPeople, // All team members
    agenda: seedAgendas[1],
    notes: seedMeetingNotes[1],
    takeaways: seedTakeaways[1],
    actionItems: [actionItemIds.ai3, actionItemIds.ai4],
    coachScore: 92,
    coachFeedback: "Excellent preparation and facilitation. Clear action items defined. Strong alignment achieved across the team.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [meetingIds.retrospective],
    status: "completed",
    objectiveId: objectiveIds.q1Growth,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-10T15:00:00Z"),
  },
  {
    id: meetingIds.retrospective,
    name: "Sprint Retrospective",
    aiSummary: "Team reflected on sprint performance. Celebrated communication improvements and identified testing process as next improvement area.",
    googleCalendarId: "evt_retro_sprint3_2024",
    startTime: new Date("2024-01-20T14:00:00Z"),
    duration: 2700, // 45 minutes
    people: [seedPeople[0], seedPeople[1], seedPeople[2]], // Alice, Bob, Charlie
    agenda: seedAgendas[2],
    notes: seedMeetingNotes[2],
    takeaways: seedTakeaways[2],
    actionItems: [actionItemIds.ai5, actionItemIds.ai6],
    coachScore: 88,
    coachFeedback: "Good balance of positive feedback and constructive criticism. Action items are specific and measurable. Consider timeboxing discussions better.",
    previousConnectedMeetings: [meetingIds.planning],
    nextConnectedMeetings: [],
    status: "completed",
    objectiveId: objectiveIds.q1Growth,
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-20T15:30:00Z"),
  },
  {
    id: meetingIds.oneOnOne,
    name: "1:1 Alice & Bob",
    aiSummary: "Career development discussion and project status update. Bob expressed interest in leadership opportunities.",
    googleCalendarId: "evt_1on1_alice_bob_2024",
    startTime: new Date("2024-01-18T11:00:00Z"),
    duration: 1800, // 30 minutes
    people: [seedPeople[0], seedPeople[1]], // Alice, Bob
    actionItems: [],
    coachScore: 78,
    coachFeedback: "Good rapport and open communication. Consider documenting career development goals more formally.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "completed",
    objectiveId: objectiveIds.productLaunch,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-18T11:30:00Z"),
  },
];

// Action Items
export const seedActionItems: ActionItem[] = [
  {
    id: actionItemIds.ai1,
    item: "Complete UI component library documentation",
    meetingId: meetingIds.standup1,
    objectiveId: objectiveIds.productLaunch,
    status: "in_progress",
    priority: "high",
    assignedTo: seedPeople[2], // Charlie
    dueDate: new Date("2024-01-17"),
    createdAt: new Date("2024-01-15T09:30:00Z"),
    updatedAt: new Date("2024-01-15T09:30:00Z"),
  },
  {
    id: actionItemIds.ai2,
    item: "Review and merge API integration PR",
    meetingId: meetingIds.standup1,
    objectiveId: objectiveIds.productLaunch,
    status: "completed",
    priority: "high",
    assignedTo: seedPeople[0], // Alice
    dueDate: new Date("2024-01-16"),
    completedAt: new Date("2024-01-16T14:00:00Z"),
    createdAt: new Date("2024-01-15T09:30:00Z"),
    updatedAt: new Date("2024-01-16T14:00:00Z"),
  },
  {
    id: actionItemIds.ai3,
    item: "Finalize Q1 budget allocation for engineering",
    meetingId: meetingIds.planning,
    objectiveId: objectiveIds.q1Growth,
    status: "completed",
    priority: "high",
    assignedTo: seedPeople[3], // Diana
    dueDate: new Date("2024-01-15"),
    completedAt: new Date("2024-01-14T16:00:00Z"),
    createdAt: new Date("2024-01-10T15:00:00Z"),
    updatedAt: new Date("2024-01-14T16:00:00Z"),
  },
  {
    id: actionItemIds.ai4,
    item: "Set up weekly progress tracking dashboard",
    meetingId: meetingIds.planning,
    objectiveId: objectiveIds.q1Growth,
    status: "in_progress",
    priority: "medium",
    assignedTo: seedPeople[1], // Bob
    dueDate: new Date("2024-01-25"),
    createdAt: new Date("2024-01-10T15:00:00Z"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: actionItemIds.ai5,
    item: "Implement automated testing pipeline",
    meetingId: meetingIds.retrospective,
    objectiveId: objectiveIds.productLaunch,
    status: "not_started",
    priority: "high",
    assignedTo: seedPeople[1], // Bob
    dueDate: new Date("2024-02-01"),
    createdAt: new Date("2024-01-20T15:30:00Z"),
    updatedAt: new Date("2024-01-20T15:30:00Z"),
  },
  {
    id: actionItemIds.ai6,
    item: "Schedule code review training session",
    meetingId: meetingIds.retrospective,
    objectiveId: objectiveIds.q1Growth,
    status: "not_started",
    priority: "medium",
    assignedTo: seedPeople[0], // Alice
    dueDate: new Date("2024-01-30"),
    createdAt: new Date("2024-01-20T15:30:00Z"),
    updatedAt: new Date("2024-01-20T15:30:00Z"),
  },
];

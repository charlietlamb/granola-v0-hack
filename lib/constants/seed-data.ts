import type {
  Person,
  Objective,
  Meeting,
  ActionItem,
  Agenda,
  MeetingNote,
  Takeaways,
} from "@/lib/types/meeting";

// Generate UUIDs for people
const personIds = {
  alice: crypto.randomUUID(),
  bob: crypto.randomUUID(),
  charlie: crypto.randomUUID(),
  diana: crypto.randomUUID(),
  emma: crypto.randomUUID(),
  frank: crypto.randomUUID(),
  grace: crypto.randomUUID(),
  henry: crypto.randomUUID(),
  isabel: crypto.randomUUID(),
  jack: crypto.randomUUID(),
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
  {
    id: personIds.emma,
    name: "Emma Wilson",
    email: "emma@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.frank,
    name: "Frank Thompson",
    email: "frank@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.grace,
    name: "Grace Lee",
    email: "grace@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.henry,
    name: "Henry Brown",
    email: "henry@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.isabel,
    name: "Isabel Garcia",
    email: "isabel@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: personIds.jack,
    name: "Jack Robinson",
    email: "jack@company.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Objectives
const objectiveIds = {
  q1Growth: crypto.randomUUID(),
  productLaunch: crypto.randomUUID(),
  customerSuccess: crypto.randomUUID(),
};

export const seedObjectives: Objective[] = [
  {
    id: objectiveIds.q1Growth,
    name: "Q1 Revenue Growth - 20% Increase",
    dueDate: new Date("2024-03-31"),
    meetings: [],
    knowledgeBase: "https://company.com/docs/q1-objectives",
    status: "in_progress",
    priority: "high",
    owner: seedPeople[0],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: objectiveIds.productLaunch,
    name: "Launch Mobile App V2",
    dueDate: new Date("2024-04-15"),
    meetings: [],
    knowledgeBase: "https://company.com/docs/mobile-v2",
    status: "in_progress",
    priority: "high",
    owner: seedPeople[1],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: objectiveIds.customerSuccess,
    name: "Improve Customer Satisfaction Score to 95%",
    dueDate: new Date("2024-06-30"),
    meetings: [],
    knowledgeBase: "https://company.com/docs/customer-success",
    status: "in_progress",
    priority: "medium",
    owner: seedPeople[3],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
];

// Helper to get today's date at specific time
const getDate = (daysOffset: number, hour: number, minute: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

// Meetings - spread across multiple days
export const seedMeetings: Meeting[] = [
  // TODAY
  {
    id: crypto.randomUUID(),
    name: "Morning Standup",
    aiSummary:
      "Quick sync on daily progress and blockers. Team is on track.",
    googleCalendarId: "evt_standup_001",
    startTime: getDate(0, 9, 0),
    duration: 900, // 15 min
    people: [seedPeople[0], seedPeople[1], seedPeople[2], seedPeople[4]],
    actionItems: [],
    coachScore: 88,
    coachFeedback:
      "Good time management. Consider adding more specific updates.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "completed",
    objectiveId: objectiveIds.productLaunch,
    createdAt: getDate(0, 8, 0),
    updatedAt: getDate(0, 9, 15),
  },
  {
    id: crypto.randomUUID(),
    name: "Design Review - Mobile App",
    aiSummary:
      "Reviewed latest UI mockups. Discussed accessibility improvements.",
    googleCalendarId: "evt_design_001",
    startTime: getDate(0, 10, 30),
    duration: 2700, // 45 min
    people: [seedPeople[1], seedPeople[4], seedPeople[6], seedPeople[7]],
    actionItems: [],
    coachScore: 92,
    coachFeedback: "Great collaboration. Clear action items defined.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "completed",
    objectiveId: objectiveIds.productLaunch,
    createdAt: getDate(0, 8, 0),
    updatedAt: getDate(0, 11, 15),
  },
  {
    id: crypto.randomUUID(),
    name: "1:1 Alice & Bob",
    aiSummary: "Career development and project status discussion.",
    googleCalendarId: "evt_1on1_001",
    startTime: getDate(0, 14, 0),
    duration: 1800, // 30 min
    people: [seedPeople[0], seedPeople[1]],
    actionItems: [],
    coachScore: 85,
    coachFeedback: "Good rapport. Consider documenting key decisions.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    createdAt: getDate(-1, 10, 0),
    updatedAt: getDate(-1, 10, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Product Strategy Session",
    aiSummary:
      "Q2 roadmap planning. Discussed feature prioritization and market research.",
    googleCalendarId: "evt_strategy_001",
    startTime: getDate(0, 15, 30),
    duration: 3600, // 60 min
    people: [
      seedPeople[0],
      seedPeople[1],
      seedPeople[3],
      seedPeople[5],
      seedPeople[8],
    ],
    actionItems: [],
    coachScore: 94,
    coachFeedback: "Excellent facilitation and strategic thinking.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    createdAt: getDate(-2, 15, 0),
    updatedAt: getDate(-2, 15, 0),
  },

  // TOMORROW
  {
    id: crypto.randomUUID(),
    name: "Engineering All-Hands",
    aiSummary:
      "Company updates, Q1 results, and upcoming initiatives announced.",
    googleCalendarId: "evt_allhands_001",
    startTime: getDate(1, 9, 0),
    duration: 3600, // 60 min
    people: seedPeople,
    actionItems: [],
    coachScore: 78,
    coachFeedback: "Good information sharing. Could improve Q&A time.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    createdAt: getDate(-3, 10, 0),
    updatedAt: getDate(-3, 10, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Customer Feedback Review",
    aiSummary:
      "Analyzed recent customer surveys and support tickets. Identified improvement areas.",
    googleCalendarId: "evt_customer_001",
    startTime: getDate(1, 11, 0),
    duration: 2700, // 45 min
    people: [seedPeople[3], seedPeople[4], seedPeople[6], seedPeople[8]],
    actionItems: [],
    coachScore: 91,
    coachFeedback: "Data-driven discussion. Clear follow-up actions.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    objectiveId: objectiveIds.customerSuccess,
    createdAt: getDate(-1, 14, 0),
    updatedAt: getDate(-1, 14, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "API Architecture Discussion",
    aiSummary: "Technical deep-dive on microservices migration strategy.",
    googleCalendarId: "evt_arch_001",
    startTime: getDate(1, 13, 30),
    duration: 5400, // 90 min
    people: [
      seedPeople[1],
      seedPeople[2],
      seedPeople[5],
      seedPeople[7],
      seedPeople[9],
    ],
    actionItems: [],
    coachScore: 89,
    coachFeedback: "Technical depth was excellent. Consider timebox better.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    objectiveId: objectiveIds.productLaunch,
    createdAt: getDate(-2, 9, 0),
    updatedAt: getDate(-2, 9, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Marketing & Sales Sync",
    aiSummary: "Campaign performance review and lead generation strategy.",
    googleCalendarId: "evt_marketing_001",
    startTime: getDate(1, 16, 0),
    duration: 1800, // 30 min
    people: [seedPeople[0], seedPeople[3], seedPeople[5], seedPeople[8]],
    actionItems: [],
    coachScore: 86,
    coachFeedback: "Good alignment. More concrete metrics would help.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    objectiveId: objectiveIds.q1Growth,
    createdAt: getDate(-1, 11, 0),
    updatedAt: getDate(-1, 11, 0),
  },

  // DAY AFTER TOMORROW
  {
    id: crypto.randomUUID(),
    name: "Sprint Planning",
    aiSummary:
      "Planned sprint 12 work. Estimated 45 story points. Discussed technical debt.",
    googleCalendarId: "evt_sprint_001",
    startTime: getDate(2, 10, 0),
    duration: 3600, // 60 min
    people: [
      seedPeople[0],
      seedPeople[1],
      seedPeople[2],
      seedPeople[4],
      seedPeople[7],
      seedPeople[9],
    ],
    actionItems: [],
    coachScore: 90,
    coachFeedback: "Well organized. Good velocity discussion.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    objectiveId: objectiveIds.productLaunch,
    createdAt: getDate(-4, 15, 0),
    updatedAt: getDate(-4, 15, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Security Review",
    aiSummary:
      "Quarterly security audit. Reviewed access controls and compliance.",
    googleCalendarId: "evt_security_001",
    startTime: getDate(2, 14, 0),
    duration: 2700, // 45 min
    people: [seedPeople[1], seedPeople[5], seedPeople[7]],
    actionItems: [],
    coachScore: 87,
    coachFeedback: "Thorough review. Follow up on action items promptly.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    createdAt: getDate(-5, 10, 0),
    updatedAt: getDate(-5, 10, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "UX Research Findings",
    aiSummary:
      "Presented user testing results. Discussed navigation improvements.",
    googleCalendarId: "evt_ux_001",
    startTime: getDate(2, 15, 30),
    duration: 2700, // 45 min
    people: [seedPeople[4], seedPeople[6], seedPeople[7], seedPeople[8]],
    actionItems: [],
    coachScore: 93,
    coachFeedback: "Excellent presentation. Data-driven recommendations.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    objectiveId: objectiveIds.productLaunch,
    createdAt: getDate(-3, 12, 0),
    updatedAt: getDate(-3, 12, 0),
  },

  // NEXT WEEK
  {
    id: crypto.randomUUID(),
    name: "Q1 Business Review",
    aiSummary: "Quarterly results presentation. Revenue targets exceeded.",
    googleCalendarId: "evt_qbr_001",
    startTime: getDate(5, 10, 0),
    duration: 5400, // 90 min
    people: seedPeople.slice(0, 8),
    actionItems: [],
    coachScore: 95,
    coachFeedback: "Outstanding presentation. Clear metrics and insights.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    objectiveId: objectiveIds.q1Growth,
    createdAt: getDate(-7, 16, 0),
    updatedAt: getDate(-7, 16, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Team Retrospective",
    aiSummary:
      "Sprint 11 retrospective. Celebrated wins and identified improvements.",
    googleCalendarId: "evt_retro_001",
    startTime: getDate(5, 14, 0),
    duration: 2700, // 45 min
    people: [
      seedPeople[0],
      seedPeople[1],
      seedPeople[2],
      seedPeople[4],
      seedPeople[9],
    ],
    actionItems: [],
    coachScore: 88,
    coachFeedback: "Good balance of positive and constructive feedback.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    createdAt: getDate(-6, 11, 0),
    updatedAt: getDate(-6, 11, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Infrastructure Planning",
    aiSummary:
      "Discussed cloud migration timeline and cost optimization strategies.",
    googleCalendarId: "evt_infra_001",
    startTime: getDate(6, 11, 0),
    duration: 3600, // 60 min
    people: [seedPeople[1], seedPeople[5], seedPeople[7], seedPeople[9]],
    actionItems: [],
    coachScore: 84,
    coachFeedback: "Technical discussion was solid. More cost analysis needed.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    createdAt: getDate(-5, 14, 0),
    updatedAt: getDate(-5, 14, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Client Demo - Enterprise Features",
    aiSummary: "Demonstrated new enterprise features to potential clients.",
    googleCalendarId: "evt_demo_001",
    startTime: getDate(6, 15, 0),
    duration: 1800, // 30 min
    people: [seedPeople[0], seedPeople[3], seedPeople[4]],
    actionItems: [],
    coachScore: 91,
    coachFeedback: "Great demo flow. Client engagement was high.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "scheduled",
    createdAt: getDate(-4, 9, 0),
    updatedAt: getDate(-4, 9, 0),
  },

  // YESTERDAY
  {
    id: crypto.randomUUID(),
    name: "Bug Triage",
    aiSummary: "Prioritized critical bugs. Assigned owners for P0 issues.",
    googleCalendarId: "evt_bugs_001",
    startTime: getDate(-1, 10, 0),
    duration: 1800, // 30 min
    people: [seedPeople[1], seedPeople[2], seedPeople[7]],
    actionItems: [],
    coachScore: 82,
    coachFeedback: "Efficient prioritization. Follow up on assignments.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "completed",
    createdAt: getDate(-2, 14, 0),
    updatedAt: getDate(-1, 10, 30),
  },
  {
    id: crypto.randomUUID(),
    name: "Onboarding - New Team Members",
    aiSummary:
      "Welcome session for new hires. Covered company culture and processes.",
    googleCalendarId: "evt_onboard_001",
    startTime: getDate(-1, 13, 0),
    duration: 3600, // 60 min
    people: [seedPeople[0], seedPeople[6], seedPeople[8], seedPeople[9]],
    actionItems: [],
    coachScore: 89,
    coachFeedback: "Warm welcome. Comprehensive overview provided.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "completed",
    createdAt: getDate(-8, 10, 0),
    updatedAt: getDate(-1, 14, 0),
  },
  {
    id: crypto.randomUUID(),
    name: "Performance Optimization Review",
    aiSummary:
      "Analyzed app performance metrics. Identified bottlenecks in API calls.",
    googleCalendarId: "evt_perf_001",
    startTime: getDate(-1, 15, 30),
    duration: 2700, // 45 min
    people: [seedPeople[1], seedPeople[2], seedPeople[5]],
    actionItems: [],
    coachScore: 90,
    coachFeedback: "Data-driven approach. Clear optimization plan.",
    previousConnectedMeetings: [],
    nextConnectedMeetings: [],
    status: "completed",
    objectiveId: objectiveIds.productLaunch,
    createdAt: getDate(-3, 11, 0),
    updatedAt: getDate(-1, 16, 15),
  },
];

// Minimal agendas, notes, takeaways, and action items (not used in display but needed for seed)
export const seedAgendas: Agenda[] = [];
export const seedMeetingNotes: MeetingNote[] = [];
export const seedTakeaways: Takeaways[] = [];
export const seedActionItems: ActionItem[] = [];

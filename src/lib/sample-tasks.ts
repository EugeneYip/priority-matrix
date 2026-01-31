import { Task } from "./types";

const now = new Date();
const isoDate = (offsetDays: number) => {
  const date = new Date(now);
  date.setDate(now.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

export const sampleTasks: Task[] = [
  {
    id: "sample-1",
    title: "Finalize quarterly roadmap",
    notes: "Align milestones with team leads and update leadership deck.",
    dueDate: isoDate(1),
    estimatedMinutes: 120,
    impactScores: {
      goalAlignment: 3,
      consequenceCost: 3,
      hardToDelegate: 2,
      compoundingValue: 2
    },
    urgencyScores: {
      deadlineProximity: 3,
      latePenalty: 2,
      dependencyPressure: 2
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sample-2",
    title: "Prep customer demo rehearsal",
    notes: "Run through the new analytics flow and capture feedback.",
    dueDate: isoDate(3),
    estimatedMinutes: 60,
    impactScores: {
      goalAlignment: 3,
      consequenceCost: 2,
      hardToDelegate: 1,
      compoundingValue: 1
    },
    urgencyScores: {
      deadlineProximity: 2,
      latePenalty: 3,
      dependencyPressure: 1
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sample-3",
    title: "Refine onboarding email copy",
    notes: "Shorten welcome series and add usage tips.",
    dueDate: isoDate(10),
    estimatedMinutes: 30,
    impactScores: {
      goalAlignment: 2,
      consequenceCost: 1,
      hardToDelegate: 0,
      compoundingValue: 2
    },
    urgencyScores: {
      deadlineProximity: 1,
      latePenalty: 1,
      dependencyPressure: 0
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sample-4",
    title: "Set Q2 leadership sync agenda",
    notes: "Draft agenda topics and send invites.",
    dueDate: isoDate(6),
    estimatedMinutes: 15,
    impactScores: {
      goalAlignment: 2,
      consequenceCost: 2,
      hardToDelegate: 1,
      compoundingValue: 1
    },
    urgencyScores: {
      deadlineProximity: 2,
      latePenalty: 1,
      dependencyPressure: 1
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sample-5",
    title: "Clear support inbox backlog",
    notes: "Handle quick triage responses for simple tickets.",
    dueDate: isoDate(0),
    estimatedMinutes: 30,
    impactScores: {
      goalAlignment: 1,
      consequenceCost: 1,
      hardToDelegate: 1,
      compoundingValue: 0
    },
    urgencyScores: {
      deadlineProximity: 3,
      latePenalty: 2,
      dependencyPressure: 2
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sample-6",
    title: "Approve expense reports",
    notes: "Sign off on finance queue for the week.",
    dueDate: isoDate(2),
    estimatedMinutes: 15,
    impactScores: {
      goalAlignment: 0,
      consequenceCost: 1,
      hardToDelegate: 0,
      compoundingValue: 0
    },
    urgencyScores: {
      deadlineProximity: 3,
      latePenalty: 2,
      dependencyPressure: 1
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sample-7",
    title: "Organize team brand assets",
    notes: "Move outdated files to archive and update structure.",
    dueDate: isoDate(20),
    estimatedMinutes: 60,
    impactScores: {
      goalAlignment: 1,
      consequenceCost: 0,
      hardToDelegate: 0,
      compoundingValue: 1
    },
    urgencyScores: {
      deadlineProximity: 0,
      latePenalty: 0,
      dependencyPressure: 0
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "sample-8",
    title: "Review conference swag options",
    notes: "Collect quotes and decide if needed this quarter.",
    dueDate: null,
    estimatedMinutes: 30,
    impactScores: {
      goalAlignment: 1,
      consequenceCost: 0,
      hardToDelegate: 0,
      compoundingValue: 0
    },
    urgencyScores: {
      deadlineProximity: 0,
      latePenalty: 0,
      dependencyPressure: 0
    },
    overrideDeadlineProximity: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

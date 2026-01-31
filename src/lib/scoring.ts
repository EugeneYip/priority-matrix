import { Quadrant, Task } from "./types";

export const QUADRANT_LABELS: Record<Quadrant, string> = {
  DO_NOW: "Do Now",
  SCHEDULED: "Scheduled",
  QUICK_WINS: "Quick Wins",
  DROP: "Drop"
};

export const QUADRANT_DESCRIPTIONS: Record<Quadrant, string> = {
  DO_NOW: "High impact and time-sensitive priorities.",
  SCHEDULED: "Important work to plan intentionally.",
  QUICK_WINS: "Fast wins to clear quickly.",
  DROP: "Low value items to remove or defer."
};

export const QUADRANT_NEXT_STEP: Record<Quadrant, string> = {
  DO_NOW: "Start now. Define the first 5-minute action and do it.",
  SCHEDULED: "Schedule it. Pick a start date and protect a time block.",
  QUICK_WINS: "Keep it small. Finish in one short pass or delegate if possible.",
  DROP: "Drop it. Archive the task or move to Someday."
};

export function getImpactTotal(task: Task) {
  return Object.values(task.impactScores).reduce((sum, value) => sum + value, 0);
}

export function getEffectiveUrgencyScores(task: Task) {
  if (task.overrideDeadlineProximity) return task.urgencyScores;
  return {
    ...task.urgencyScores,
    deadlineProximity: getDeadlineProximityScore(task.dueDate)
  };
}

export function getUrgencyTotal(task: Task) {
  return Object.values(getEffectiveUrgencyScores(task)).reduce(
    (sum, value) => sum + value,
    0
  );
}

export function isImportant(impactTotal: number, impactThreshold: number) {
  return impactTotal >= impactThreshold;
}

export function isUrgent(urgencyTotal: number, urgencyThreshold: number) {
  return urgencyTotal >= urgencyThreshold;
}

export function getQuadrant(
  impactTotal: number,
  urgencyTotal: number,
  impactThreshold: number,
  urgencyThreshold: number
): Quadrant {
  const important = isImportant(impactTotal, impactThreshold);
  const urgent = isUrgent(urgencyTotal, urgencyThreshold);

  if (important && urgent) return "DO_NOW";
  if (important && !urgent) return "SCHEDULED";
  if (!important && urgent) return "QUICK_WINS";
  return "DROP";
}

export function getDeadlineProximityScore(dueDate: string | null) {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return 0;
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / msPerDay);
  if (diffDays <= 2) return 3;
  if (diffDays <= 7) return 2;
  if (diffDays <= 14) return 1;
  return 0;
}

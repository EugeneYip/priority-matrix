export type ImpactKey =
  | "goalAlignment"
  | "consequenceCost"
  | "hardToDelegate"
  | "compoundingValue";

export type UrgencyKey =
  | "deadlineProximity"
  | "latePenalty"
  | "dependencyPressure";

export type Quadrant =
  | "DO_NOW"
  | "SCHEDULED"
  | "QUICK_WINS"
  | "DROP";

export type TaskStatus = "active" | "archived";

export interface Task {
  id: string;
  title: string;
  notes: string;
  dueDate: string | null;
  estimatedMinutes: number | null;
  impactScores: Record<ImpactKey, number>;
  urgencyScores: Record<UrgencyKey, number>;
  overrideDeadlineProximity: boolean;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  impactThreshold: number;
  urgencyThreshold: number;
}

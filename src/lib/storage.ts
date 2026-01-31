import { Settings, Task } from "./types";

const TASKS_KEY = "priority-matrix-tasks";
const SETTINGS_KEY = "priority-matrix-settings";

export const defaultSettings: Settings = {
  impactThreshold: 7,
  urgencyThreshold: 5
};

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(TASKS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      impactThreshold: parsed.impactThreshold ?? defaultSettings.impactThreshold,
      urgencyThreshold: parsed.urgencyThreshold ?? defaultSettings.urgencyThreshold
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

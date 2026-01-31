"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDeadlineProximityScore,
  getImpactTotal,
  getQuadrant,
  getUrgencyTotal,
  QUADRANT_LABELS,
  QUADRANT_NEXT_STEP
} from "@/lib/scoring";
import { ImpactKey, Settings, Task, UrgencyKey } from "@/lib/types";

const impactFields: {
  key: ImpactKey;
  label: string;
  helper: string;
}[] = [
  {
    key: "goalAlignment",
    label: "Goal Alignment",
    helper: "Does this directly advance a priority goal this week or month?"
  },
  {
    key: "consequenceCost",
    label: "Consequence Cost",
    helper: "If I don’t do this, how costly is it?"
  },
  {
    key: "hardToDelegate",
    label: "Hard to Delegate",
    helper: "Does this require me specifically?"
  },
  {
    key: "compoundingValue",
    label: "Compounding Value",
    helper: "Will this make future work meaningfully easier or higher quality?"
  }
];

const urgencyFields: {
  key: UrgencyKey;
  label: string;
  helper: string;
  isDeadline?: boolean;
}[] = [
  {
    key: "deadlineProximity",
    label: "Deadline Proximity",
    helper: "Auto-scored from the due date by default.",
    isDeadline: true
  },
  {
    key: "latePenalty",
    label: "Late Penalty",
    helper: "If this is late, how bad is the outcome?"
  },
  {
    key: "dependencyPressure",
    label: "Dependency Pressure",
    helper: "Are others waiting on me to move forward?"
  }
];

const scoreOptions = [0, 1, 2, 3];

interface TaskFormProps {
  task?: Task;
  settings: Settings;
  onCancel: () => void;
  onSave: (task: Task) => void;
}

const defaultTaskState: Task = {
  id: "",
  title: "",
  notes: "",
  dueDate: null,
  estimatedMinutes: null,
  impactScores: {
    goalAlignment: 0,
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
  createdAt: "",
  updatedAt: ""
};

export default function TaskForm({ task, settings, onCancel, onSave }: TaskFormProps) {
  const [form, setForm] = useState<Task>({ ...defaultTaskState, ...task });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setForm({ ...defaultTaskState, ...task });
  }, [task]);

  useEffect(() => {
    if (!form.overrideDeadlineProximity) {
      const computed = getDeadlineProximityScore(form.dueDate);
      setForm((prev) => ({
        ...prev,
        urgencyScores: {
          ...prev.urgencyScores,
          deadlineProximity: computed
        }
      }));
    }
  }, [form.dueDate, form.overrideDeadlineProximity]);

  const impactTotal = useMemo(() => getImpactTotal(form), [form]);
  const urgencyTotal = useMemo(() => getUrgencyTotal(form), [form]);
  const quadrant = useMemo(
    () =>
      getQuadrant(
        impactTotal,
        urgencyTotal,
        settings.impactThreshold,
        settings.urgencyThreshold
      ),
    [impactTotal, urgencyTotal, settings]
  );

  const handleImpactChange = (key: ImpactKey, value: number) => {
    setForm((prev) => ({
      ...prev,
      impactScores: {
        ...prev.impactScores,
        [key]: value
      }
    }));
  };

  const handleUrgencyChange = (key: UrgencyKey, value: number) => {
    setForm((prev) => ({
      ...prev,
      urgencyScores: {
        ...prev.urgencyScores,
        [key]: value
      }
    }));
  };

  const validate = () => {
    const nextErrors: string[] = [];
    if (!form.title.trim()) {
      nextErrors.push("Task title is required.");
    }
    const impactValues = Object.values(form.impactScores);
    const urgencyValues = Object.values(form.urgencyScores);
    if (impactValues.some((value) => value < 0 || value > 3)) {
      nextErrors.push("Impact scores must be between 0 and 3.");
    }
    if (urgencyValues.some((value) => value < 0 || value > 3)) {
      nextErrors.push("Urgency scores must be between 0 and 3.");
    }
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
      updatedAt: new Date().toISOString(),
      createdAt: form.createdAt || new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200" htmlFor="title">
            Task Title
          </label>
          <input
            id="title"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="min-h-[96px] w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200" htmlFor="dueDate">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              value={form.dueDate ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  dueDate: event.target.value ? event.target.value : null
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200" htmlFor="estimated">
              Estimated Time
            </label>
            <select
              id="estimated"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              value={form.estimatedMinutes ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  estimatedMinutes: event.target.value
                    ? Number(event.target.value)
                    : null
                }))
              }
            >
              <option value="">Select minutes</option>
              {[5, 15, 30, 60, 120].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Impact Scores</h3>
          <div className="space-y-3">
            {impactFields.map((field) => (
              <div key={field.key} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{field.label}</p>
                    <p className="text-xs text-slate-400">{field.helper}</p>
                  </div>
                  <select
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                    value={form.impactScores[field.key]}
                    onChange={(event) =>
                      handleImpactChange(field.key, Number(event.target.value))
                    }
                  >
                    {scoreOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Urgency Scores</h3>
          <div className="space-y-3">
            {urgencyFields.map((field) => (
              <div key={field.key} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{field.label}</p>
                    <p className="text-xs text-slate-400">{field.helper}</p>
                    {field.isDeadline && (
                      <p className="text-xs text-indigo-200">
                        Auto score: {getDeadlineProximityScore(form.dueDate)}
                      </p>
                    )}
                  </div>
                  <select
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                    value={form.urgencyScores[field.key]}
                    onChange={(event) =>
                      handleUrgencyChange(field.key, Number(event.target.value))
                    }
                    disabled={field.isDeadline && !form.overrideDeadlineProximity}
                  >
                    {scoreOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                {field.isDeadline && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-200">
                    <input
                      id="override-deadline"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                      checked={form.overrideDeadlineProximity}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          overrideDeadlineProximity: event.target.checked
                        }))
                      }
                    />
                    <label htmlFor="override-deadline">Override deadline proximity</label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {errors.length > 0 && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            <ul className="list-disc space-y-1 pl-4">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
          >
            Save Task
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-panel">
        <h3 className="text-lg font-semibold text-white">Live Preview</h3>
        <div className="mt-4 space-y-4 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <span>Impact Score</span>
            <span className="font-semibold text-white">{impactTotal} / 12</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Urgency Score</span>
            <span className="font-semibold text-white">{urgencyTotal} / 9</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Important?</span>
            <span className="font-semibold text-white">
              {impactTotal >= settings.impactThreshold ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Urgent?</span>
            <span className="font-semibold text-white">
              {urgencyTotal >= settings.urgencyThreshold ? "Yes" : "No"}
            </span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Quadrant
            </p>
            <p className="text-lg font-semibold text-white">
              {QUADRANT_LABELS[quadrant]}
            </p>
            <p className="mt-2 text-xs text-slate-300">{QUADRANT_NEXT_STEP[quadrant]}</p>
          </div>
        </div>
      </aside>
    </form>
  );
}

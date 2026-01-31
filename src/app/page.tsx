"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TaskForm from "@/components/TaskForm";
import {
  getImpactTotal,
  getQuadrant,
  getUrgencyTotal,
  QUADRANT_DESCRIPTIONS,
  QUADRANT_LABELS,
  QUADRANT_NEXT_STEP
} from "@/lib/scoring";
import { defaultSettings, loadSettings, loadTasks, saveTasks } from "@/lib/storage";
import { sampleTasks } from "@/lib/sample-tasks";
import { Quadrant, Settings, Task } from "@/lib/types";

const quadrantOrder: Quadrant[] = [
  "DO_NOW",
  "SCHEDULED",
  "QUICK_WINS",
  "DROP"
];

const quadrantStyles: Record<Quadrant, string> = {
  DO_NOW: "from-rose-500/20 via-slate-900/80 to-slate-900",
  SCHEDULED: "from-indigo-500/20 via-slate-900/80 to-slate-900",
  QUICK_WINS: "from-amber-500/20 via-slate-900/80 to-slate-900",
  DROP: "from-slate-700/30 via-slate-900/90 to-slate-900"
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [search, setSearch] = useState("");
  const [showTodayFocus, setShowTodayFocus] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status === "active"),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const base = activeTasks.filter((task) => {
      if (!normalized) return true;
      return (
        task.title.toLowerCase().includes(normalized) ||
        task.notes.toLowerCase().includes(normalized)
      );
    });
    if (!showTodayFocus) return base;
    return base.filter((task) => {
      const impactTotal = getImpactTotal(task);
      const urgencyTotal = getUrgencyTotal(task);
      return (
        getQuadrant(
          impactTotal,
          urgencyTotal,
          settings.impactThreshold,
          settings.urgencyThreshold
        ) === "DO_NOW"
      );
    });
  }, [activeTasks, search, showTodayFocus, settings]);

  const tasksByQuadrant = useMemo(() => {
    const map: Record<Quadrant, Task[]> = {
      DO_NOW: [],
      SCHEDULED: [],
      QUICK_WINS: [],
      DROP: []
    };
    filteredTasks.forEach((task) => {
      const impactTotal = getImpactTotal(task);
      const urgencyTotal = getUrgencyTotal(task);
      const quadrant = getQuadrant(
        impactTotal,
        urgencyTotal,
        settings.impactThreshold,
        settings.urgencyThreshold
      );
      map[quadrant].push(task);
    });
    return map;
  }, [filteredTasks, settings]);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleSaveTask = (task: Task) => {
    setTasks((prev) => {
      const exists = prev.find((item) => item.id === task.id);
      if (exists) {
        return prev.map((item) => (item.id === task.id ? task : item));
      }
      return [
        {
          ...task,
          id: task.id || `task-${Date.now()}`
        },
        ...prev
      ];
    });
    closeModal();
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "archived",
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleAddSampleTasks = () => {
    setTasks((prev) => {
      const existingIds = new Set(prev.map((task) => task.id));
      const next = sampleTasks.filter((task) => !existingIds.has(task.id));
      return [...next, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Priority Matrix
            </p>
            <h1 className="text-2xl font-semibold text-white">Personal Dashboard</h1>
            <p className="text-sm text-slate-400">
              Score tasks by impact and urgency to decide what deserves focus.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              onClick={openCreateModal}
            >
              Add Task
            </button>
            <button
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              onClick={handleAddSampleTasks}
            >
              Add sample tasks
            </button>
            <Link
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              href="/settings"
            >
              Settings
            </Link>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-6 pb-6">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
            <span className="text-slate-500">🔍</span>
            <input
              type="search"
              placeholder="Search by title or notes"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <label className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
              checked={showTodayFocus}
              onChange={(event) => setShowTodayFocus(event.target.checked)}
            />
            Show only Today’s Focus
          </label>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pt-10">
        <div
          className={`grid gap-6 ${
            showTodayFocus ? "md:grid-cols-1" : "md:grid-cols-2"
          }`}
        >
          {quadrantOrder
            .filter((quadrant) => !showTodayFocus || quadrant === "DO_NOW")
            .map((quadrant) => {
              const quadrantTasks = tasksByQuadrant[quadrant];
              return (
                <section
                  key={quadrant}
                  className={`rounded-3xl border border-slate-800 bg-gradient-to-br p-6 shadow-panel ${
                    quadrantStyles[quadrant]
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {QUADRANT_LABELS[quadrant]}
                      </h2>
                      <p className="text-sm text-slate-300">
                        {QUADRANT_DESCRIPTIONS[quadrant]}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-200">
                      {quadrantTasks.length} tasks
                    </span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {quadrantTasks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 p-6 text-sm text-slate-400">
                        No tasks here yet.
                      </div>
                    ) : (
                      quadrantTasks.map((task) => {
                        const impactTotal = getImpactTotal(task);
                        const urgencyTotal = getUrgencyTotal(task);
                        return (
                          <article
                            key={task.id}
                            className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-card"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {task.title}
                                </h3>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                  {QUADRANT_LABELS[quadrant]} quadrant
                                </p>
                              </div>
                              <div className="flex gap-2 text-xs">
                                <button
                                  className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-slate-500"
                                  onClick={() => openEditModal(task)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="rounded-full border border-emerald-500/60 px-3 py-1 text-emerald-100 transition hover:border-emerald-400"
                                  onClick={() => handleCompleteTask(task.id)}
                                >
                                  Complete
                                </button>
                                <button
                                  className="rounded-full border border-rose-500/60 px-3 py-1 text-rose-100 transition hover:border-rose-400"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                              <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                                <p className="text-slate-400">Due Date</p>
                                <p className="text-sm text-white">
                                  {task.dueDate ?? "No date"}
                                </p>
                              </div>
                              <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                                <p className="text-slate-400">Estimated Time</p>
                                <p className="text-sm text-white">
                                  {task.estimatedMinutes
                                    ? `${task.estimatedMinutes} minutes`
                                    : "Not set"}
                                </p>
                              </div>
                              <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                                <p className="text-slate-400">Impact Score</p>
                                <p className="text-sm text-white">
                                  {impactTotal} / 12
                                </p>
                              </div>
                              <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                                <p className="text-slate-400">Urgency Score</p>
                                <p className="text-sm text-white">
                                  {urgencyTotal} / 9
                                </p>
                              </div>
                            </div>
                            {task.notes && (
                              <p className="mt-3 text-sm text-slate-300">
                                {task.notes}
                              </p>
                            )}
                            <div className="mt-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-100">
                              {QUADRANT_NEXT_STEP[quadrant]}
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>
              );
            })}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 px-6 py-10">
          <div className="w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {editingTask ? "Edit Task" : "Add Task"}
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {editingTask ? "Update task details" : "Create a new task"}
                </h2>
              </div>
              <button
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
            <div className="mt-6">
              <TaskForm
                task={editingTask ?? undefined}
                settings={settings}
                onCancel={closeModal}
                onSave={handleSaveTask}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

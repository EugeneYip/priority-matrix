"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultSettings, loadSettings, saveSettings } from "@/lib/storage";
import { Settings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Settings
            </p>
            <h1 className="text-2xl font-semibold text-white">Scoring thresholds</h1>
            <p className="text-sm text-slate-400">
              Adjust what counts as important or urgent.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-panel">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200" htmlFor="impact">
                Impact threshold
              </label>
              <input
                id="impact"
                type="number"
                min={0}
                max={12}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100"
                value={settings.impactThreshold}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    impactThreshold: Number(event.target.value)
                  }))
                }
              />
              <p className="text-xs text-slate-400">
                Default is 7. Tasks above this score are marked important.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200" htmlFor="urgency">
                Urgency threshold
              </label>
              <input
                id="urgency"
                type="number"
                min={0}
                max={9}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100"
                value={settings.urgencyThreshold}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    urgencyThreshold: Number(event.target.value)
                  }))
                }
              />
              <p className="text-xs text-slate-400">
                Default is 5. Tasks above this score are marked urgent.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              onClick={() => setSettings(defaultSettings)}
            >
              Reset to defaults
            </button>
            <span className="text-sm text-slate-400">
              Settings are saved automatically in your browser.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

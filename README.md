# Priority Matrix Dashboard

A personal priority matrix dashboard that scores tasks by impact and urgency to keep your focus on the most important work.

## Features
- Dashboard-style 2x2 matrix with Do Now, Scheduled, Quick Wins, and Drop quadrants.
- Task cards include due dates, estimated time, scores, quadrant label, and next-step guidance.
- Add/edit tasks in a modal with live scoring preview and auto deadline proximity scoring.
- LocalStorage persistence for tasks, archived tasks, and settings.
- Configurable impact and urgency thresholds with reset-to-defaults option.
- Sample task seeding for quick demos.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- LocalStorage persistence

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the app at `http://localhost:3000`.

## Limitations
- Single-user local app with no authentication or cloud storage.
- Archived tasks are stored locally but not shown on the dashboard.

## Future Improvements
- Archived tasks view and restore workflow.
- Export/import for tasks and settings.
- Optional reminders or notifications.

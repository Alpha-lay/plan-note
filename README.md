# PlanNote

PlanNote is an early-stage open-source personal planning assistant for tasks, notes, calendar views, reminders, and lightweight decision tracking. It is built with React, TypeScript, Vite, and Tailwind CSS.

The project started as a practical daily planning tool and is now being prepared for a new development phase focused on AI-assisted productivity features.

## Why This Project Exists

Many personal planning tools are either too heavy for daily use or too simple to connect tasks, notes, reminders, and decision context. PlanNote aims to keep the workflow small and local-first while still supporting useful reminders and future AI assistance.

## Features

- Task management with date, time, priority, completion state, and reminders
- Calendar view for browsing daily tasks and notes
- Note records grouped by date
- Browser notification fallback
- WeChat reminder support through ServerChan
- Local data persistence with `localStorage`
- PWA support for installable use on mobile and desktop browsers
- Decision and voting views for lightweight planning choices

## Planned AI Features

The next phase of PlanNote will use OpenAI API credits to prototype practical user-facing features:

- Break large tasks into smaller actionable steps
- Summarize notes into daily or weekly planning context
- Suggest priorities based on task dates, time, and urgency
- Generate clearer reminder messages
- Turn rough notes into structured tasks
- Help users review unfinished work and plan the next day

The goal is to publish the implementation openly so other developers can learn from a small, practical AI productivity app.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- date-fns
- Lucide React

## Quick Start

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## WeChat Reminder Setup

PlanNote supports WeChat reminders through ServerChan.

1. Create or open a ServerChan account.
2. Get your personal SendKey.
3. Enter the SendKey inside the app.
4. Create a task with a reminder time.

Do not commit a real SendKey to this repository. Use `sendkey.example.json` only as a placeholder reference.

## Privacy And Security

- Task and note data are stored locally in the browser.
- Reminder keys should be treated as secrets.
- The project does not require a backend for the core local planning workflow.
- See [SECURITY.md](SECURITY.md) for responsible disclosure and known security priorities.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the current development plan.

## Contributing

Contributions, issues, and suggestions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Project Status

PlanNote is an early-stage public open-source project. The current priority is to improve documentation, security hygiene, and the AI feature roadmap before the next round of development.

## License

MIT. See [LICENSE](LICENSE).

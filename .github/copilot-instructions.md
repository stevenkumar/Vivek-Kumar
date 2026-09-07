# Copilot instructions for Vivek-Kumar

## Project overview

This is a React/Vite portfolio with a small Express API and an in-browser admin console.

- `frontend/` contains the React 19 application. `frontend/src/App.jsx` switches between the public hash views (`home`, `projects`, `about`, `contact`, and `photos`) and the `#admin` console.
- `backend/api/` contains the shared Express app, split into route modules, controllers, middleware, utilities, and JSON data files.
- The backend is file-based; there is no database. Runtime content is stored in `backend/api/data/*.json`, and uploaded files are served from `backend/api/uploads/`.
- Render runs the shared Express app from `backend/api/index.js` as a single Node service.
- The Vite build writes to the repository-level `dist/` directory. The backend serves that build when it exists, so Render can host the API and SPA from one service.

## Commands

Run these from the repository root unless noted:

```bash
# Install all workspace dependencies
npm install
cd frontend && npm install
cd ..\backend && npm install
cd ..

# Frontend development server (http://localhost:5173)
npm run dev

# Backend development server (http://localhost:5000)
npm run backend:dev

# Run frontend and backend together
npm run dev:all

# Production frontend build into dist/
npm run build

# Serve the built app/API with Node
npm start
```

Frontend-only checks:

```bash
cd frontend
npm run lint
npm run build
```

There is no configured automated test runner or test script in the root, frontend, or backend package manifests, so there is currently no single-test command. For a quick API smoke check while the backend is running, use `curl http://localhost:5000/api/health`, `curl http://localhost:5000/api/projects`, or `curl "http://localhost:5000/api/media?category=photo"`.

## Configuration and deployment

- Copy `.env.example`/`backend/.env.example` to the appropriate `.env` file for local work. Backend configuration includes `PORT`, `CLIENT_URL`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, and optional `ADMIN_PASSWORD`.
- Do not commit `.env`, uploads, or generated build output. The backend also loads environment variables from both `backend/.env` and `backend/api/.env` if present.
- `frontend/vite.config.js` proxies `/api` and `/uploads` to `http://localhost:5000` during development and aliases `@` to `frontend/src`.
- `render.yaml` builds with `npm ci && npm run build`, starts with `npm start`, and uses `/api/health` as its health check.
- `render.yaml` is the recommended full-featured deployment because the admin console needs writable JSON/upload storage; configure a persistent disk for production.

## Backend conventions

- Keep the request flow `route -> controller -> store/util`. Add new endpoints to the relevant route module and keep filesystem/email work out of route declarations.
- Use the existing JSON response envelope: `{ success: true, data, message }` for successful API responses and `{ success: false, message }` for errors.
- Use `readJson` and `writeJson` from `backend/api/store.js` for data files rather than reading files directly in controllers. Match both numeric `id` and string `_id` when updating or deleting records, as existing project/message handlers do.
- Public resource routes are `/api/settings`, `/api/projects`, `/api/media`, and `/api/contact`. Admin operations use the existing `/admin` suffixes (for example `/api/projects/admin` and `/api/settings/admin/settings`); preserve these paths and payload shapes when extending the admin UI.
- Contact submissions are saved to `messages.json` and then sent through `backend/api/utils/mailer.js`. Keep validation before persistence and preserve `replyTo` behavior for email replies.
- `settings.json` is the server-side source for profile, socials, theme, and admin password. Public settings responses must not expose `adminPassword`.
- Media records are read from `photos.json` and filtered with the `category` query parameter. Static uploaded files are exposed under `/uploads`.

## Frontend conventions

- Use functional React components and hooks. Existing UI code is mostly JSX, with a few reusable TypeScript UI primitives under `frontend/src/components/ui/`.
- Reuse `useSettings` from `frontend/src/context/SettingsContext.jsx` for profile, social, and theme data. It merges server settings with defaults, persists a local fallback in `localStorage` under `portfolio_settings`, and applies CSS variables through `frontend/src/config/theme.config.js`.
- Use the semantic theme classes and CSS variables defined in `frontend/src/index.css` (`bg-theme-*`, `text-theme-*`, `border-theme`, `gradient-primary`, etc.) instead of hard-coding theme colors in new components.
- Public data views fetch `/api/projects`, `/api/media`, and `/api/settings`; preserve their fallback behavior when adding server-backed content. The projects view falls back to `frontend/src/data/projects.js` when the API is unavailable or empty.
- Navigation is hash-based and coordinated by `App.jsx`; use its `onNavigate` callbacks rather than introducing a second router.
- Keep animation patterns consistent with the existing Framer Motion usage (`AnimatePresence`, page transitions, skeleton states, and motion cards).
- Keep API calls relative (`/api/...` and `/uploads/...`) so the Vite proxy and deployed same-origin setup both work.
- Admin state is held by `AdminPanel.jsx`; login tokens are kept in `sessionStorage` as `admin_token`, and admin sections are selected through the existing `AdminLayout` tabs.
- Admin API calls use `frontend/src/lib/api.js` to send the session token as a bearer token. Keep `requireAdmin` on every non-login admin route.

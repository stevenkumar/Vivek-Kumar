# Copilot instructions for Vivek-Kumar

## Project Overview

This is a modern client-side React 19 + TypeScript portfolio built with Vite and Tailwind CSS v4. There is no custom backend server or internal API route. Contact messages are dispatched directly to the visitor's inbox using the Web3Forms REST API.

- **Routing & State:** The portfolio uses a multi-view client-side hash router managed by `src/App.tsx` (`home`, `projects`, `about`, and `contact`).
- **Data Stores:** Project details live in `src/data/projects.ts`. Profile, social links, and theme defaults are configured in `src/context/SettingsContext.tsx` and persisted in `localStorage` under `portfolio_settings`.
- **Styling:** Tailwind CSS v4 is configured via `@tailwindcss/vite` and `src/index.css`. Theme custom properties are dynamically injected from `src/config/theme.config.ts`.
- **Contact Submissions:** Form submissions are handled via `https://api.web3forms.com/submit` using `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY`.
- **Production Build:** Vite compiles TypeScript and bundles output into `dist/`. The output can be deployed as a static site to Vercel, Netlify, or GitHub Pages with zero server dependencies.

## Commands

Run from the repository root:

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:5173)
npm run dev

# Type-check and build production bundle into dist/
npm run build

# Preview the production build locally
npm run preview

# Lint source code
npm run lint
```

## Architectural Conventions

- Write 100% strict TypeScript (`.ts` and `.tsx`). All component props, interfaces, and shared models must be strongly typed.
- Reuse `useSettings` from `src/context/SettingsContext.tsx` for dynamic profile, social links, and theme state.
- Use predefined semantic theme utility classes (`bg-theme-canvas`, `bg-theme-card`, `text-theme-base`, `text-theme-muted`, `border-theme`, `gradient-primary`) rather than ad-hoc color hardcoding.
- Maintain Framer Motion animation patterns across transitions, modals, and interactive UI components.
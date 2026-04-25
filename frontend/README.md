# Cafe review — frontend

React, TypeScript, Vite, and **Tailwind CSS v4** (`@tailwindcss/vite`).

## Design schema

- **[DESIGN_SCHEMA.md](./DESIGN_SCHEMA.md)** — how Pinterest-inspired tokens map to this app and Tailwind.
- **[src/design/schema.ts](./src/design/schema.ts)** — typed color, radius, spacing, and typography constants aligned with that schema.
- **`src/index.css`** — `@theme` block exposing those tokens as Tailwind utilities.

Run `npm run dev` for local development with HMR.

# Frontend design schema (Pinterest-inspired)

This project’s UI tokens follow the **Pinterest-inspired** language documented in VoltAgent’s [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) study (`design-md/pinterest/DESIGN.md`): warm canvas, plum-tinted text, olive/sand neutrals, and **Pinterest Red** (`#e60023`) as the sole bold CTA accent.

During local development, the same narrative tokens are available under:

`awesome-design-md-main/design-md/pinterest/` (see `DESIGN.md`, `preview.html`, `preview-dark.html`).

## Machine-readable tokens

| Location | Role |
|----------|------|
| [`src/design/schema.ts`](./src/design/schema.ts) | Hex values, radii, spacing scale, typography sizes, breakpoint numbers for TypeScript. |
| [`src/index.css`](./src/index.css) | Tailwind v4 `@theme` — maps tokens to utilities (`bg-pinterest-red`, `text-plum`, etc.). |

## Tailwind utility map (summary)

| Concept | Token / class |
|---------|----------------|
| Page background | `bg-canvas` (`#ffffff`) |
| Primary text | `text-plum` (`#211922`) |
| Muted text | `text-olive` |
| Borders / input stroke | `border-warm-silver` |
| Primary button | `bg-pinterest-red text-ink` (black label on red, per reference) |
| Secondary button | `bg-sand-gray text-ink` |
| Focus ring | `ring-2 ring-focus-blue` (outline pattern simplified) |
| Surfaces / badges | `bg-warm-wash`, `bg-fog` |
| Errors (forms) | `text-error-red`, `border-error-red` |
| Font | `font-sans` (Pin Sans stack from DESIGN.md, system fallbacks) |
| Button / input radius | `rounded-pinterest-input` (16px) |
| Card radius | `rounded-pinterest-card` (12px) |

## Principles (from DESIGN.md)

- Warm neutrals only; avoid cold blue-grays for large surfaces.
- Use Pinterest Red **only** for primary actions — one confident accent.
- Prefer **plum black** for body copy, not pure black as the default text color.
- Generous rounding (12px+ cards, 16px buttons/inputs); not pill-shaped for primary rectangles.
- Minimal elevation: rely on color and radius, not heavy shadows.

## Implementation notes

- **Tailwind CSS v4** is wired via `@tailwindcss/vite` in `vite.config.ts`.
- **Pin Sans** is not bundled; the stack matches the reference fallbacks until a licensed webfont is added.

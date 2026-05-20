# Cladd — guidance for Claude Code

Cladd is an opinionated React UI kit for dense, application-grade UIs (editors, dashboards, inspectors, internal tooling). Dark-first, Tailwind v4, React 19+, single sizing scale, eleven accent colors. Published as `@cladd-ui/react`.

Public site: [cladd.io](https://cladd.io) · Docs: [cladd.io/react](https://cladd.io/react/)

## Repository layout

- `src/` — component source. This is what ships as `@cladd-ui/react`.
  - `src/components/` — one file per component.
  - `src/hooks/` — public hooks (`useDialog`, `useToast`, `useTheme`, `useAccentColor`, `useSurface`, `useDevice`).
  - `src/styles/` — Tailwind v4 `@theme` blocks and CSS layers.
  - `src/cladd.css` — public stylesheet entry.
  - `src/shared/`, `src/types.ts`, `src/index.ts` — shared utilities, prop types, public exports.
- `playground/` — local Vite sandbox. Imports `@cladd-ui/react` directly from `src/` so edits hot-reload.
- `packages/react/` — build output. **Do not edit by hand.**
- `scripts/` — `build.mjs`, `changelog.mjs`, `release.mjs`.

## Running things

The maintainer usually keeps the dev server running on port 5173. Check `lsof -ti:5173` before starting a new one.

- `npm run dev` — playground (Vite, port 5173). Edits in `src/` hot-reload.
- `npm run check-types` — `tsc --noEmit`.
- `npm run format` — oxfmt write. `npm run format:check` is what CI runs.
- `npm run build` — produces `packages/react/`.
- `npm run release` — maintainer-only: bumps version, regenerates changelog, builds, tags, publishes.

Package manager is **npm** (the repo uses `package-lock.json`). Node 20+.

## Conventions

These are the non-obvious ones — the rest follows from the code.

**State vs. variants.** Use class names for static variants (color, size, shape). Use `data-*` attributes only for runtime state (`data-open`, `data-disabled`, `data-selected`). This is consistent across the kit — match neighboring components.

**Opinionated by design.** The kit's value is its small, coherent surface area. Be skeptical of new props that exist for "flexibility" — a new `variant`, a new `size`, a new escape hatch. If a change broadens the API, flag it and ask before implementing.

**Sizing.** One scale: `2xs`, `xs`, `sm`, `md` (default, 28 px), `lg`, `xl`, `2xl`. A `Chip` inside a `Button` at the same `size` should compose without manual tuning.

**Accent colors.** Eleven: `neutral`, `brand`, `red`, `pink`, `purple`, `blue`, `cyan`, `lime`, `green`, `yellow`, `orange`. Set per component or per region via `useAccentColor`.

**Surfaces nest.** `Surface` / `SurfaceCut` have five depth levels that auto-bump when nested. Don't hand-pick colors per card.

**No new dependencies** without discussion.

**Comments.** Default to none. Add one only when the _why_ is non-obvious — a hidden constraint, a workaround, a surprising invariant. Don't restate what the code does.

**TypeScript.** Strict. Every component re-exports its props and size union — keep that pattern.

**Formatter.** [oxfmt](https://github.com/oxc-project/oxc). Run `npm run format` before committing; CI runs `format:check`.

## Commit style

[Conventional Commits](https://www.conventionalcommits.org/). The changelog is generated from them — `npm run release` parses commit history since the last tag.

Format: `type: short summary` (lowercase, present tense, under ~70 chars).

Types in use: `feat`, `fix`, `perf`, `ref`/`refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore`.

Examples from the log:

```
feat: readOnly and disabled for SearchField
fix: NumberField to hold its width
feat: button pointer when href is passed too
```

## When working on a component

1. Find the file in `src/components/<Name>.tsx`.
2. Check neighboring components for the conventions above (data-attrs, size prop, color prop, ref forwarding).
3. Add or update a playground example in `playground/App.tsx` so the change is visible.
4. Run `npm run check-types` and `npm run format`.

## See also

- [README.md](./README.md) — user-facing intro and install.
- [CONTRIBUTING.md](./CONTRIBUTING.md) — full contributor guide (bug reports, feature proposals, PR flow).

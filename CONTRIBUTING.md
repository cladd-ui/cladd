# Contributing to Cladd

Thanks for taking the time to look at cladd. This document explains how to file bugs, suggest features, and submit code changes.

By participating, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## A note on scope

Cladd is **opinionated** by design. Every component, every default, and every visual decision is tuned for a specific kind of UI — dense, application-grade, dark-first. Pull requests that loosen those opinions (a new `variant`, a new `size`, a new prop for "flexibility") will usually be declined unless they fit cleanly inside the existing system.

That's not a brush-off — it's the only way the kit stays small and coherent. If you're unsure whether your idea fits, **open an issue first** and we'll talk through it before you spend time on code.

## Reporting bugs

Open an issue at [github.com/cladd-ui/cladd/issues](https://github.com/cladd-ui/cladd/issues) and include:

- The cladd version (`@cladd-ui/react` from your `package.json`).
- React and Tailwind versions.
- The framework you're using (Next.js, Vite, etc.).
- A minimal reproduction — a short code snippet, a CodeSandbox/StackBlitz, or a small repo. Bugs that need a real reproduction without one are hard to act on.
- What you expected vs. what happened.

For visual bugs, a screenshot or short screen recording is worth a thousand words.

## Suggesting features or new components

Open an issue first. Describe:

- The concrete UI problem you're trying to solve (not the proposed API).
- Where you've hit this problem — ideally with a screenshot or a reference from a real app.
- Whether existing cladd primitives could compose to solve it.

New components have a high bar. They need to fit the surface system, the sizing scale, the accent-color palette, and the dark-first theming — and they need to be the kind of thing real apps reach for repeatedly.

## Development setup

Requirements:

- **Node.js 20+**
- **npm** (the repo uses `package-lock.json`)

Clone and install:

```bash
git clone https://github.com/cladd-ui/cladd.git
cd cladd
npm install
```

Run the playground (used to develop and visually test components):

```bash
npm run dev
```

This starts a Vite dev server. The playground lives in `playground/` and imports `@cladd-ui/react` directly from source — your edits in `src/` hot-reload immediately.

Other scripts:

```bash
npm run check-types   # tsc --noEmit
npm run format        # oxfmt (write)
npm run format:check  # oxfmt (verify, used in CI)
npm run build         # build the publishable package into packages/react/
```

## Repository layout

- `src/` — the component source. This is what gets published as `@cladd-ui/react`.
- `src/components/` — one file per component.
- `src/hooks/` — public hooks (`useDialog`, `useToast`, `useTheme`, etc.).
- `src/styles/` — Tailwind v4 `@theme` blocks and CSS layers.
- `src/cladd.css` — the public stylesheet entry point.
- `packages/react/` — build output; do not edit by hand.
- `playground/` — the local dev sandbox.
- `scripts/` — build, changelog, and release tooling.

## Code style

- **Formatter:** [oxfmt](https://github.com/oxc-project/oxc). Run `npm run format` before committing. CI runs `npm run format:check`.
- **Types:** strict TypeScript. Run `npm run check-types` before opening a PR.
- **Comments:** by default, no comments. Only add one when the _why_ is non-obvious — a hidden constraint, a workaround, a surprising invariant. Don't explain what the code does; the code does that.
- **State vs. variants:** use class names for static variants (color, size, shape) and `data-*` attributes only for runtime state (open, disabled, selected). This is enforced by convention across the kit — match what neighboring components do.
- **No new dependencies** without discussion. The whole point of cladd is a small, predictable surface area.

## Commit messages

The project uses [Conventional Commits](https://www.conventionalcommits.org/) — the changelog is generated from them.

Format: `type: short summary`

Types:

- `feat:` — new feature
- `fix:` — bug fix
- `perf:` — performance improvement
- `ref:` or `refactor:` — refactor with no behavior change
- `docs:` — documentation only
- `style:` — formatting, whitespace, etc.
- `test:` — tests only
- `build:` — build system or tooling
- `ci:` — CI configuration
- `chore:` — anything else

Examples from the repo:

```
feat: readOnly and disabled for SearchField
fix: NumberField to hold its width
feat: button pointer when href is passed too
```

Keep the summary lowercase, present tense, under ~70 characters. Add a longer body if the change needs explanation.

## Pull requests

1. Fork the repo and create a branch from `master`.
2. Make your change. Keep PRs focused — one feature or fix per PR.
3. Run `npm run check-types` and `npm run format` locally.
4. Update or add a playground example if you're touching a component, so reviewers can see the change in action.
5. Open the PR. In the description, link the related issue and explain the _why_, not just the _what_.

Small, well-scoped PRs get reviewed fastest. A 30-line fix with a clear repro will land before a 600-line PR that "also cleans up a few things."

## Releases

Releases are cut by the maintainer using `npm run release`, which bumps the version, regenerates the changelog from commits since the last tag, builds, tags, and publishes. Contributors don't need to touch versions or `CHANGELOG.md` — those are generated.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE), the same license that covers the rest of the project.

## Questions

If something here is unclear, open an issue and ask — the docs improving is also a contribution.

# Cladd

**A React UI kit for building actual apps.**

Cladd is an opinionated React UI kit for editors, dashboards, settings panels, and internal tooling — the kind of UI where a sidebar, a canvas, an inspector, and forty controls have to coexist on one screen and still stay legible.

It ships with a defined visual identity: recessed and raised surfaces, a single sizing scale, eleven accent colors, dark-first theming, and a complete set of application-grade controls.

- **Website:** [cladd.io](https://cladd.io)
- **Docs:** [cladd.io/react](https://cladd.io/react/)
- **About:** [cladd.io/about](https://cladd.io/about/)

## Why cladd

- **Surfaces that nest.** Recessed and raised levels auto-bump when you nest them — no manual color picking, no per-card overrides.
- **One sizing scale.** Seven steps from `2xs` to `2xl`. Drop a `Chip` inside a `Button` at the same `size` and it just fits.
- **Eleven accent colors.** `neutral`, `brand`, `red`, `pink`, `purple`, `blue`, `cyan`, `lime`, `green`, `yellow`, `orange` — set per component or per region.
- **Controlled overlays.** Open a `Dialog`, `Popover`, `Toast`, or `Tooltip` imperatively from a hook — no `<Root>`/`<Portal>`/`<Content>` scaffolding sprinkled across files.
- **Dense, not crowded.** Tuned for information-rich screens: tight gaps, sharp type, default `md` height of 28 px.
- **Dark-first, light included.**
- **First-class TypeScript.** Every component re-exports its props and size union.

## Installation

```bash
npm install @cladd-ui/react
```

Import the stylesheet after Tailwind, in the same CSS file:

```css
@import 'tailwindcss';
@import '@cladd-ui/react/css';
```

Wrap your app in `CladdProvider` once, as high in the tree as possible:

```tsx
import { CladdProvider } from '@cladd-ui/react';

export default function App({ children }) {
  return <CladdProvider>{children}</CladdProvider>;
}
```

Framework-specific guides for Next.js, Vite, TanStack Start, React Router, Astro, and plain React are at [cladd.io/react/installation](https://cladd.io/react/installation/).

### Requirements

- **React 19+**
- **Tailwind CSS v4**
- A bundler that respects CSS import order (the cladd stylesheet must load after Tailwind).

## Quick example

```tsx
import { Button, Surface, useDialog } from '@cladd-ui/react';

export function Example() {
  const dialog = useDialog();

  return (
    <Surface>
      <Button
        color="red"
        onClick={() =>
          dialog.confirm({
            title: 'Delete project?',
            text: 'This cannot be undone.',
            confirmButtonText: 'Delete',
            confirmButtonColor: 'red',
            onConfirm: () => {
              // delete the project
            },
          })
        }
      >
        Delete
      </Button>
    </Surface>
  );
}
```

## What's in the box

- **Surfaces** — `Surface`, `SurfaceCut`, with five depth levels that nest contextually.
- **Controls** — `Button`, `Input`, `NumberField`, `Textarea`, `SearchField`, `OTPField`, `Select`, `Slider`, `Checkbox`, `Radio`, `Switch`, `Segmented`, `Chip`, `Shortcut`, `Link`, `Spinner`.
- **Layout** — `Toolbar`, `List`, `ListItem`, `ListButton`, `ListSeparator`, `ListTitle`, `SectionTitle`.
- **Overlays** — `Dialog`, `Popover`, `Popup`, `Tooltip`, `Toast`, `Backdrop`.
- **Hooks** — `useDialog`, `useToast`, `useTheme`, `useAccentColor`, `useSurface`, `useDevice`.

Full component reference: [cladd.io/react](https://cladd.io/react/).

## Already shipping in

- [Swiper Studio](https://studio.swiperjs.com/) — visual editor for Swiper sliders
- [t0ggles](https://t0ggles.com/) — project management
- [PaneFlow](https://paneflow.com/) — animated slideshow editor
- [Start Page HQ](https://startpagehq.com/) — custom New Tab dashboard

## License

[MIT](./LICENSE) — free forever.

Built by [Vladimir Kharlampidi](https://nolimits4web.com) — also the author of [Swiper](https://swiperjs.com), [Framework7](https://framework7.io), and [Konsta UI](https://konstaui.com).

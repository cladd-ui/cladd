# Changelog

## 0.4.2 (2026-05-14)

### Features

- add viewportMargin prop to Popover for edge spacing (08dc818)
- switch back popover to absolute (313da07)
- switch Popover to default fixed position (566af86)

## 0.4.1 (2026-05-14)

### Features

- forward rounded, clearButton and input class props in SearchField (81a4634)

## 0.4.0 (2026-05-14)

### Features

- add overlayClassName prop (c77e085)
- switch default overlay position to "above" (807fd2b)
- surface/cut overlay position (c57699b)
- tweak hover/press variants (24b0a4d)

### Bug Fixes

- nested surface state propagation (182a6e6)

### Refactoring

- simplify surface hover/press variants (2660da3)

## 0.3.0 (2026-05-14)

### Refactoring

- default Chip variant to 'gradient' (2e59aa3)

## 0.2.0 (2026-05-14)

### Refactoring

- pass outline and variant through Chip directly (b05a6a7)

## 0.1.0 (2026-05-14)

### Bug Fixes

- focus input on click anywhere in the field surface (f11fa80)
- nested hoverable/clickable surface states (c8fd795)

## 0.0.55 (2026-05-13)

### Features

- prevent nested hoverables (f971a7b)

### Documentation

- contributing and code of conduct (8edf4b7)
- README (b27d71f)

## 0.0.54 (2026-05-12)

### Features

- readOnly and disabled for SearchField (0e1d77f)

## 0.0.53 (2026-05-12)

### Bug Fixes

- NumberField to hold its width (3152741)

## 0.0.52 (2026-05-12)

### Bug Fixes

- NumberField to hold its width (0f9593d)

## 0.0.51 (2026-05-12)

### Features

- button pointer when href is passed too (15950d5)

## 0.0.50 (2026-05-12)

### Features

- types export: PopoverPosition, SurfaceVariant (74d4904)

## 0.0.49 (2026-05-12)

### Features

- add missing docs (489b319)
- select docs (fec04c6)

## 0.0.48 (2026-05-11)

### Features

- tweak Link (06f06f2)

## 0.0.47 (2026-05-11)

### Features

- tweak Link states (cf9180d)

## 0.0.46 (2026-05-11)

### Features

- SurfaceCut beforeContent slot (e8eb04f)

## 0.0.45 (2026-05-11)

### Features

- Link component (7b34cd8)

## 0.0.44 (2026-05-11)

### Bug Fixes

- check for window in useDevice (40ad5d5)

## 0.0.43 (2026-05-11)

- _No notable changes since previous release_

## 0.0.42 (2026-05-11)

### Features

- simplify Select (ab4d890)

### Bug Fixes

- components tweaks and fixes (4192336)

### Refactoring

- UIProvider -> CladdProvider (5c4796a)

## 0.0.41 (2026-05-11)

### Features

- OTP and Switch tweaks (10faf84)

## 0.0.40 (2026-05-11)

### Features

- fix auto generated OTP field (11b1cbb)

## 0.0.39 (2026-05-11)

### Features

- tweak Scrubber styles (ace4f41)
- change number input save logic (095db07)

## 0.0.38 (2026-05-11)

### Features

- NumberField fixes and tweaks (365cae4)

## 0.0.37 (2026-05-11)

### Features

- NumberField input (0675176)

## 0.0.36 (2026-05-11)

### Features

- tweak Textarea styles (5a2dea0)

## 0.0.35 (2026-05-11)

### Features

- Input and Textarea improvements (5d6ac3f)
- simplify input layout (730c084)

## 0.0.34 (2026-05-11)

### Features

- fix input numbers (34a5c38)

## 0.0.33 (2026-05-11)

### Features

- overlays tweaks (2d09130)

## 0.0.32 (2026-05-11)

### Features

- export hook types (e06c666)

## 0.0.31 (2026-05-10)

### Features

- tweak Dialog's input (37d0e94)

## 0.0.30 (2026-05-10)

### Features

- export overlays compound props (1b928a9)

## 0.0.29 (2026-05-10)

### Features

- tweak toast (6339637)

## 0.0.28 (2026-05-10)

### Features

- tweak toast styles (bf9bd12)

## 0.0.27 (2026-05-10)

### Features

- tweak types (507a149)

## 0.0.26 (2026-05-10)

### Features

- align Toast's icon with how it works in Chip (abb88ae)

## 0.0.25 (2026-05-10)

### Features

- tweak chip sizes (9c744e0)

## 0.0.24 (2026-05-10)

### Features

- rename knob -> thumb (01fac98)

## 0.0.23 (2026-05-10)

### Features

- switch brand color to "blue" (55361d8)
- Spinner to SVG (1486aea)
- cladd- font sizes + more sizes uniform (3964b0d)
- rework spinner to usual cut circle (6688b97)
- new NumberScrubber component (caec92c)

## 0.0.22 (2026-05-04)

### Documentation

- more docs tweaks (99eb11f)

## 0.0.21 (2026-05-04)

### Documentation

- update types docs (e35e726)

## 0.0.20 (2026-05-03)

### Refactoring

- data-level -> cladd-surface-level- class (b63661e)
- data-color -> cladd-color- class (ad62894)

## 0.0.19 (2026-05-03)

### Features

- add custom spacings and radii to cn util (8cf80de)

## 0.0.18 (2026-05-03)

### Features

- add surfaceLevel prop to Chip (2c4901e)

## 0.0.17 (2026-05-03)

### Features

- lots of refacotring, css variables and renames (a193ff8)
- finalize parts and data- states (17450a9)
- begin parts (a7fcac9)
- remove unused popup.css (ced8499)
- namespace CSS vars and props (0b52fa3)
- class surface-level-n -> [data-level="n"] (a590e85)
- class color-_ to data-color=_ (0284752)
- zed oxfmt (42f4edd)
- rename classes to scoped (e011fb2)

### Build System

- fix build (9a795c9)

## 0.0.16 (2026-04-29)

### Features

- add export types for CSS (1ef3f7b)

### Refactoring

- rename prop component -> as (1876bf2)

### Other

- format (432469a)

## 0.0.15 (2026-04-27)

### Features

- add /ui export (f31432f)

## 0.0.14 (2026-04-26)

### Build System

- bundle Colors and add extensions (29c311f)

## 0.0.13 (2026-04-26)

### Features

- OTP - add placeholder (fd7aaf4)
- Shortcut - render as <kbd> (dec931a)

### Chores

- placeholder in OTP (8195af4)

## 0.0.12 (2026-04-26)

### Features

- correct support for fill variants in Shortcut (da71422)

### Other

- Update App.tsx (e1c64f0)

## 0.0.11 (2026-04-26)

### Features

- new ListTitle + BlockTitle -> SectionTitle (9e2a1d6)
- tooltip forwards surfaceLevel (34080fd)
- tweak shortcut styles (ece529d)

### Refactoring

- Preloader -> Spinner, Range -> Slider, WithTooltip -> Tooltip, Searchbar -> SearchField (8df4dea)

## 0.0.10 (2026-04-26)

### Refactoring

- rename togglesColor -> indicatorColor (a79344e)

## 0.0.9 (2026-04-26)

### Refactoring

- rename Toggle -> Switch (2b015eb)

## 0.0.8 (2026-04-26)

### Features

- add SurfaceContextProvider to bundle (b1c895e)

## 0.0.7 (2026-04-26)

### Features

- add icons to xport (1613597)

## 0.0.6 (2026-04-26)

### Features

- update icons (312cab6)
- add Shortcut component (43c2afd)

## 0.0.5 (2026-04-26)

### Build System

- gh release (a68df92)

## 0.0.4 (2026-04-26)

### Features

- add changelog (6d769ef)
- OTFField component (78de5f6)
- add contentClassName prop to Toolbar (7cc0b88)
- Number Field is surface now (b51deea)
- new Toolbar components (256568d)
- rounded utilities (43bb397)

### Refactoring

- -> RefObject (3e86eb2)

## 0.0.2 (2026-04-26)

- initial release

# mock-macos — macOS desktop chrome, in the system's language

The recognisable macOS shell reskinned in design-system tokens: Apple-style
menu bar, Dock, traffic-light window chrome, Spotlight, Control Center and
Notification Center panels. Cool sheet/field grounds, one bronze accent,
hairline borders (never drop shadows), mono chrome type. Traffic lights map
onto the status tokens (`err` / `warn` / `ok`); a focused window wears a
bronze hairline — the bridge to `mocks/tui`'s `.mock-tui-win.focused`.

Chrome only — Finder/Notes/app content stays in the consuming prototype.

## Import order

```html
<link rel="stylesheet" href="../../styles.css" />       <!-- the system -->
<link rel="stylesheet" href="../../mocks/macos/macos-chrome.css" />
```

Pairs naturally with `mocks/stage/` for the letterboxed fixed canvas.

## Classes

| Class | What |
|---|---|
| `.mock-macos` | scope root (put it on the canvas) — carries the shell radii custom props (`--mock-macos-win-radius` 11px, `--mock-macos-panel-radius` 13px, `--mock-macos-tile-radius` 8px, `--mock-macos-menubar-h` 34px) |
| `.mock-macos-wallpaper` | ground + geometric motif — `.wall-rings` / `.wall-dots` / `.wall-hatch` / `.wall-grid` / `.wall-plain`, with a `.motif` child |
| `.mock-macos-menubar` | menu bar — `.mb-item(.logo/.app-name/.open)`, `.mb-stat`, `.mb-menu`, `.batt`, `.bars`, `.cc-glyph` children |
| `.mock-macos-window` | traffic-light window — `.focused`, `.plain-title`; `.titlebar`, `.lights .lt.close/.min/.zoom`, `.tb-*`, `.win-body` children |
| `.mock-macos-dock` | Dock — `.dock`, `.dock-app(.accent/.mono/.cal/.running/.bounce)`, `.tip` children |
| `.mock-macos-overlay` | full-screen scrim; `.spot` variant positions Spotlight |
| `.mock-macos-spotlight` | Spotlight panel — `.spot-input`, `.spot-list`, `.spot-row(.sel)` children |
| `.mock-macos-panel` | frosted panel; `.cc` (Control Center: `.cc-grid`, `.cc-tile`, `.cc-conn`, `.slider`, `.cc-theme`, `.np`) and `.nc` (Notification Center: `.nc-card`, `.nc-note`, `.wdg-*`) |

The shell radii deliberately exceed the 2–4px house rule so the silhouettes
read as genuinely macOS; buttons and fields inside stay small-radius.

## Rules

- Zero raw hex/rgba literals — translucent chrome uses
  `color-mix(in srgb, var(--color-*) N%, transparent)`; the scrim is
  `--color-scrim`; the theme-picker swatches derive from
  `--color-bg` / `--color-text-heading` so both read in both modes.
- Transitions/animations are guarded by `prefers-reduced-motion`.

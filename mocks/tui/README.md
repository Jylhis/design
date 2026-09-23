# mock-tui — Norton-Commander TUI shell chrome

Generic chrome for the graphics-free TUI desktop mock: double-line box
frames with titles embedded in the border, top menu bar, always-visible
F1–F10 function-key bar, decorator-hairline wallpapers, scrim + double-line
modal boxes, and the bronze-hairline focused-pane treatment.

Chrome only — app content (terminals, file panes, monitors) stays in the
consuming prototype.

## Import order

```html
<link rel="stylesheet" href="../../styles.css" />       <!-- the system -->
<link rel="stylesheet" href="../../mocks/tui/tui-chrome.css" />
```

Pairs naturally with `mocks/stage/` for the letterboxed fixed canvas.

## Classes

| Class | What |
|---|---|
| `.mock-tui-menubar` | top bar — `.brand`, `.menu-item(.open)`, `.menu-drop`, `.status .seg` children |
| `.mock-tui-wall` | wallpaper texture — `.hatch` / `.dots` / `.scan` / `.none` |
| `.mock-tui-win` | double-line window frame — `.focused` state; `.win-title`, `.win-hint`, `.win-body` children; `.span-rows` grid helper |
| `.mock-tui-fkeys` | function-key bar — `.fkey` children, `.armed` flash state |
| `.mock-tui-overlay` | modal scrim (`--color-scrim`) |
| `.mock-tui-box` | double-line modal box — `.box-title`, `.box-esc` children |
| `.mock-tui-cursor` | blinking block caret — `.hollow` when unfocused |

## Rules

- Zero raw hex/rgba literals — every color is a `var(--color-*)` token role;
  the focused frame and armed keys are the single bronze accent.
- Transitions/animations are guarded by `prefers-reduced-motion`.

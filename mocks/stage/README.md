# mock-stage — fixed-canvas letterbox stage

The shared pattern behind every full-screen prototype: author your screen at
a fixed canvas size, scale it to fit the real viewport, letterbox it on an
ink-dark desk, and fall back to fit-to-height + horizontal pan on narrow
portrait viewports.

## Import order

```html
<link rel="stylesheet" href="../../styles.css" />       <!-- the system -->
<link rel="stylesheet" href="../../mocks/stage/stage.css" />
<script defer src="../../mocks/stage/stage.js"></script>
```

## Markup

```html
<div class="mock-stage mock-stage--vignette" data-canvas="1920x1080">
  <div class="mock-stage__frame">
    <div class="mock-stage__canvas">
      <!-- fixed 1920×1080 content -->
    </div>
  </div>
</div>
```

## API

| Hook | Meaning |
|---|---|
| `data-canvas="WxH"` | authored canvas size (default `1920x1080`) |
| `.mock-stage--vignette` | adds a faint bronze radial glow to the desk; position via `--mock-stage-vignette-pos` (default `50% 36%`) |
| `.mock-stage__canvas--bare` | canvas without its own ground fill (device frames floating on the desk) |
| `data-pan="1"` | set by `stage.js` on narrow portrait viewports — fit-to-height + horizontal pan, with a dismissible banner |
| `--mock-canvas-w/h`, `--mock-stage-scale`, `--mock-stage-w/h` | written by `stage.js`; set them yourself to skip the script |
| `window.MockStage.fit(el)` / `.fitAll()` | manual re-fit |

`stage.js` watches the DOM, so React-rendered stages are picked up
automatically.

## Rules

- Zero raw hex/rgba literals — everything derives from design-system tokens
  (`--color-text-heading` desk, `--color-scrim` in Field, `color-mix` on
  `--color-accent` for the vignette).
- The page should paint `html, body { background: var(--color-bg) }`; the
  Field desk is the scrim composited over that ground.

# mock-tablet — flat tablet device frame

A flat bezel for tablet-format prototypes: rounded slab, inset screen,
camera dot. Drawn entirely with token grounds and hairlines — no drop
shadows, no gloss (the house rules apply to device frames too).

The Android-style UI inside the screen (status bar, dock, shade…) is app
content and stays in the consuming prototype.

## Import order

```html
<link rel="stylesheet" href="../../styles.css" />       <!-- the system -->
<link rel="stylesheet" href="../../mocks/tablet/tablet-frame.css" />
```

Pairs naturally with `mocks/stage/` — put the frame inside a
`.mock-stage__canvas mock-stage__canvas--bare` so it floats on the desk.

## Markup

```html
<div class="mock-tablet" style="width: 1640px; height: 1024px">
  <div class="mock-tablet__cam"></div>
  <div class="mock-tablet__screen">…your UI…</div>
</div>
```

| Class | What |
|---|---|
| `.mock-tablet` | the bezel slab — size it from the consuming page |
| `.mock-tablet__screen` | inset screen surface (hairline ring, clips content) |
| `.mock-tablet__cam` | camera dot (scrim ink) |

## Rules

- Zero raw hex/rgba literals — bezel ring is `--color-border-strong`, the
  camera is `--color-scrim` on a hairline.

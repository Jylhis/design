# mocks/ — platform mock-template libraries

Small in-house styles libraries for prototyping **on** the design system:
platform-specific chrome (a TUI shell, a macOS desktop, a tablet bezel, and
the shared fixed-canvas stage they all sit on), expressed entirely in
design-system tokens. Prototypes import the system first, then the chrome
they need, and add only page-local app-content layout of their own.

| Package | What |
|---|---|
| [`stage/`](stage/README.md) | fixed-canvas letterbox scaler + pan fallback (`.mock-stage`, `stage.js`) |
| [`tui/`](tui/README.md) | Norton-Commander TUI shell chrome (`.mock-tui-*`) |
| [`macos/`](macos/README.md) | macOS menu bar / Dock / windows / panels (`.mock-macos-*`) |
| [`tablet/`](tablet/README.md) | flat tablet device frame (`.mock-tablet-*`) |

## Why in-house

No adoptable external library fits: TuiCss hardwires its own palette into
every component, Puppertino is a set of HIG *controls* rather than a desktop
shell, and devices.css is unmaintained and leans on stacked box-shadows the
system bans. All three are MIT and served as prior art for scope and
markup shape, but the chrome here is written from scratch against
`tokens.json` roles so it re-themes with the system for free.

## Import contract

Tokens and the system first, then the mock chrome, then (optionally) your
page-local CSS:

```html
<link rel="stylesheet" href="../../styles.css" />              <!-- 1. system -->
<link rel="stylesheet" href="../../mocks/stage/stage.css" />   <!-- 2. chrome -->
<link rel="stylesheet" href="../../mocks/tui/tui-chrome.css" />
<link rel="stylesheet" href="page.css" />                      <!-- 3. app content -->
<script defer src="../../mocks/stage/stage.js"></script>
```

The mock stylesheets declare no `@import` of their own — they assume the
system's custom properties are already on `:root`.

## No raw hex

Zero raw `#hex` / `rgba()` literals anywhere under `mocks/`. Every color is
a `var(--color-*)` token role or a `color-mix()` derivation of one
(`scripts/validate-preview-hex.mjs` scans `mocks/**/*.css` and fails CI on
any hex not present in `tokens.json`). If a value you need has no token,
derive it — do not invent a color.

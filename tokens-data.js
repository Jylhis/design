// tokens-data.js — GENERATED from tokens.json. Do not edit by hand.
// Used by index.html to render dynamic color swatches and token tables.
// Includes derived data: contrastPairs (every fg×bg×mode), swatchContrast
// (one ratio per fg role per mode against bg).
export const tokens = {
  "meta": {
    "name": "Jylhis Design System",
    "version": "1.1.0"
  },
  "groups": {
    "grounds": {
      "label": "Grounds",
      "blurb": "the survey sheet itself — page backgrounds and card surfaces, four tonal steps",
      "members": [
        "bg",
        "bg-subtle",
        "surface",
        "surface-raised",
        "scrim"
      ]
    },
    "ink": {
      "label": "Ink",
      "blurb": "what is drawn on the sheet — text in every weight",
      "members": [
        "text-heading",
        "text",
        "text-muted",
        "text-faint"
      ]
    },
    "bronze": {
      "label": "Bronze",
      "blurb": "the single interactive accent (bronze) plus the benchmark mark and its tints — links, focus rings, the datum mark",
      "members": [
        "accent",
        "accent-hover",
        "brand",
        "accent-subtle",
        "selection-bg",
        "cursor"
      ]
    },
    "line": {
      "label": "Line",
      "blurb": "survey linework — hairline borders, graticule dashes, and the structural contour blue",
      "members": [
        "border",
        "border-strong",
        "decorator",
        "contour"
      ]
    },
    "modus": {
      "label": "Modus",
      "blurb": "Modus role taxonomy — keyword, string, type, comment — set to Emacs Modus Operandi (light) / Vivendi (dark) so code is identical everywhere; never repurposed for UI",
      "members": [
        "syn-keyword",
        "syn-string",
        "syn-number",
        "syn-function",
        "syn-builtin",
        "syn-type",
        "syn-variable",
        "syn-comment",
        "syn-docstring"
      ]
    },
    "signal": {
      "label": "Signal",
      "blurb": "status colors — error, warning, ok, info; Modus hues, toned so nothing glows and always paired with a glyph + word",
      "members": [
        "status-err",
        "status-warn",
        "status-ok",
        "status-info"
      ]
    },
    "spectrum": {
      "label": "Spectrum",
      "blurb": "the 16-slot ANSI terminal palette; slot 11 is intentionally overridden to the bronze accent",
      "members": [
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "magenta",
        "cyan",
        "white",
        "bright-black",
        "bright-red",
        "bright-green",
        "bright-yellow",
        "bright-blue",
        "bright-magenta",
        "bright-cyan",
        "bright-white"
      ]
    }
  },
  "palette": {
    "bg": {
      "light": "#f6f8fb",
      "dark": "#0d0f14",
      "mono-light": "#f4f4f4",
      "mono-dark": "#0d0d0d",
      "ansi": "unspecified-bg",
      "notes": "Sheet / Field ground; cool near-white / near-black, never pure. On 16-color TTY, inherit terminal's own bg"
    },
    "bg-subtle": {
      "light": "#eef2f6",
      "dark": "#14171e",
      "mono-light": "#ececec",
      "mono-dark": "#161616",
      "x256": {
        "light": "color-253",
        "dark": "color-235",
        "mono-light": "color-253",
        "mono-dark": "color-235"
      },
      "notes": "code fills, zebra, inactive modeline; x256 indices restore the elevation step the cool near-grounds otherwise collapse into bg on a 256-color TTY"
    },
    "surface": {
      "light": "#e6ecf1",
      "dark": "#1b1f28",
      "mono-light": "#e2e2e2",
      "mono-dark": "#1f1f1f",
      "x256": {
        "light": "color-251",
        "dark": "color-237",
        "mono-light": "color-251",
        "mono-dark": "color-237"
      },
      "notes": "card / panel fill (active modeline bg); x256 pinned distinct from bg — see bg-subtle"
    },
    "surface-raised": {
      "light": "#fcfdff",
      "dark": "#232833",
      "mono-light": "#fcfcfc",
      "mono-dark": "#282828",
      "x256": {
        "dark": "color-239",
        "mono-dark": "color-239"
      },
      "notes": "plates, modals, dropdowns — above the sheet; x256 dark bumped to stay the most-elevated grayscale step. light quantizes to near-white already"
    },
    "text": {
      "light": "#23262e",
      "dark": "#d6dae2",
      "mono-light": "#2b2b2b",
      "mono-dark": "#dadada",
      "ansi": "unspecified-fg",
      "notes": "body (AAA); on 16-color TTY, inherit terminal's own fg"
    },
    "text-muted": {
      "light": "#565a63",
      "dark": "#9aa0ab",
      "mono-light": "#565656",
      "mono-dark": "#9a9a9a",
      "notes": "meta / captions / help (AA)"
    },
    "text-heading": {
      "light": "#12141a",
      "dark": "#f2f4f8",
      "mono-light": "#1a1a1a",
      "mono-dark": "#f2f2f2",
      "notes": "titles (AAA)"
    },
    "text-faint": {
      "light": "#878c95",
      "dark": "#656b76",
      "mono-light": "#7d7d7d",
      "mono-dark": "#6a6a6a",
      "notes": "graticule labels, disabled meta, decoration only (lint keeps faint off body/meta text)"
    },
    "accent": {
      "light": "#6f3e00",
      "dark": "#e0a33a",
      "mono-light": "#000000",
      "mono-dark": "#ffffff",
      "ansi": "bright-yellow",
      "notes": "bronze interactive accent, used as link text (AAA on every Sheet ground / AAA on the Field ground); ANSI slot 11 is always the bronze accent"
    },
    "accent-hover": {
      "light": "#8a4d00",
      "dark": "#f0b95c",
      "mono-light": "#333333",
      "mono-dark": "#dcdcdc",
      "notes": ":hover / :active only — lifts one bronze step from the accent"
    },
    "brand": {
      "light": "#b5450e",
      "dark": "#ef8a4a",
      "mono-light": "#3a3a3a",
      "mono-dark": "#e8e8e8",
      "notes": "benchmark vermilion — the maker's mark and datum triangle (large marks); distinct from status red"
    },
    "contour": {
      "light": "#2f4fb0",
      "dark": "#6f9be0",
      "mono-light": "#4a4a4a",
      "mono-dark": "#b0b0b0",
      "notes": "structural Modus-blue linework — contour rings, dividers, diagram strokes; structure only, never interaction"
    },
    "border": {
      "light": "#cfd6de",
      "dark": "#2b303b",
      "mono-light": "#cfcfcf",
      "mono-dark": "#333333",
      "notes": "default 1px survey hairline"
    },
    "border-strong": {
      "light": "#aab4c0",
      "dark": "#3a4150",
      "mono-light": "#b0b0b0",
      "mono-dark": "#4a4a4a",
      "notes": "table heads, field hover"
    },
    "decorator": {
      "light": "#7f8fb5",
      "dark": "#39415a",
      "mono-light": "#bdbdbd",
      "mono-dark": "#3d3d3d",
      "notes": "graticule / dashed rules (contour-faint)"
    },
    "accent-subtle": {
      "light": "#e6e2dd",
      "dark": "#262119",
      "mono-light": "#dcdcdc",
      "mono-dark": "#242424",
      "notes": "opaque approximation of accent @ ~12% on bg"
    },
    "selection-bg": {
      "light": "#ece0cf",
      "dark": "#3a2f1c",
      "mono-light": "#c8c8c8",
      "mono-dark": "#3a3a3a",
      "notes": "text selection highlight (bronze-tinted)"
    },
    "cursor": {
      "light": "#6f3e00",
      "dark": "#e0a33a",
      "mono-light": "#000000",
      "mono-dark": "#ffffff",
      "notes": "input cursor (matches accent)"
    },
    "scrim": {
      "light": "#14171e",
      "dark": "#05060a",
      "mono-light": "#141414",
      "mono-dark": "#050505",
      "notes": "modal/overlay scrim ink; emitted as translucent rgba --color-scrim in CSS (light 0.4, dark 0.55)"
    }
  },
  "syntax": {
    "syn-keyword": {
      "light": "#531ab6",
      "dark": "#b6a0ff",
      "mono-light": "#1c1c1c",
      "mono-dark": "#ededed",
      "modus": "magenta-cooler — purple keyword (Modus 4 verbatim)"
    },
    "syn-string": {
      "light": "#3548cf",
      "dark": "#79a8ff",
      "mono-light": "#3d3d3d",
      "mono-dark": "#bcbcbc",
      "modus": "blue-warmer — string (Modus 4 verbatim; 6.63:1 on the cool Sheet ground, hence the AA floor)"
    },
    "syn-number": {
      "light": "#0000b0",
      "dark": "#00bcff",
      "mono-light": "#474747",
      "mono-dark": "#b0b0b0",
      "modus": "blue-cooler — constant (Modus styles numbers as fg-main; we borrow the constant slot so numbers stay distinct)"
    },
    "syn-function": {
      "light": "#721045",
      "dark": "#feacd0",
      "mono-light": "#262626",
      "mono-dark": "#e0e0e0",
      "modus": "magenta — function name (Modus 4 verbatim)"
    },
    "syn-builtin": {
      "light": "#8f0075",
      "dark": "#f78fe7",
      "mono-light": "#424242",
      "mono-dark": "#b6b6b6",
      "modus": "magenta-warmer — builtin (Modus 4 verbatim)"
    },
    "syn-type": {
      "light": "#005f5f",
      "dark": "#6ae4b9",
      "mono-light": "#2e2e2e",
      "mono-dark": "#d6d6d6",
      "modus": "cyan-cooler — type (Modus 4 verbatim)"
    },
    "syn-variable": {
      "light": "#005e8b",
      "dark": "#00d3d0",
      "mono-light": "#333333",
      "mono-dark": "#c8c8c8",
      "modus": "cyan — variable (Modus 4 verbatim)"
    },
    "syn-comment": {
      "light": "#595959",
      "dark": "#989898",
      "mono-light": "#5a5a5a",
      "mono-dark": "#8f8f8f",
      "modus": "fg-dim — comment (italic; Modus 4 verbatim); AA on every surface"
    },
    "syn-docstring": {
      "light": "#2a5045",
      "dark": "#9ac8e0",
      "mono-light": "#505050",
      "mono-dark": "#9a9a9a",
      "modus": "green-faint (Operandi) / cyan-faint (Vivendi) — docstring, per each edition's own Modus mapping"
    }
  },
  "status": {
    "status-err": {
      "light": "#a60000",
      "dark": "#f0685f",
      "mono-light": "#1f1f1f",
      "mono-dark": "#f0f0f0",
      "ansi": "red",
      "modus": "red"
    },
    "status-warn": {
      "light": "#884900",
      "dark": "#d9b34a",
      "mono-light": "#454545",
      "mono-dark": "#b8b8b8",
      "ansi": "yellow",
      "modus": "yellow-warmer (orange-leaning; avoids blue-vs-yellow tritanopia trap)"
    },
    "status-ok": {
      "light": "#006800",
      "dark": "#6bbf6b",
      "mono-light": "#565656",
      "mono-dark": "#909090",
      "ansi": "green",
      "modus": "green"
    },
    "status-info": {
      "light": "#005e8b",
      "dark": "#5fb8cf",
      "mono-light": "#333333",
      "mono-dark": "#d0d0d0",
      "ansi": "blue",
      "modus": "cyan-blue (teal-leaning for tritanopia)"
    }
  },
  "ansi": [
    {
      "name": "black",
      "light": "#23262e",
      "dark": "#0d0f14",
      "mono-light": "#242424",
      "mono-dark": "#0d0d0d",
      "role": "text/bg inversion"
    },
    {
      "name": "red",
      "light": "#a60000",
      "dark": "#f0685f",
      "mono-light": "#1f1f1f",
      "mono-dark": "#f0f0f0",
      "role": "Modus red — errors"
    },
    {
      "name": "green",
      "light": "#006800",
      "dark": "#6bbf6b",
      "mono-light": "#565656",
      "mono-dark": "#909090",
      "role": "Modus green — ok"
    },
    {
      "name": "yellow",
      "light": "#884900",
      "dark": "#d9b34a",
      "mono-light": "#454545",
      "mono-dark": "#b8b8b8",
      "role": "Modus yellow-warmer — warnings"
    },
    {
      "name": "blue",
      "light": "#0031a9",
      "dark": "#79a8ff",
      "mono-light": "#333333",
      "mono-dark": "#d0d0d0",
      "role": "Modus blue — info"
    },
    {
      "name": "magenta",
      "light": "#721045",
      "dark": "#feacd0",
      "mono-light": "#3a3a3a",
      "mono-dark": "#c8c8c8",
      "role": "Modus magenta"
    },
    {
      "name": "cyan",
      "light": "#005a5f",
      "dark": "#6ae4b9",
      "mono-light": "#4a4a4a",
      "mono-dark": "#b0b0b0",
      "role": "Modus cyan-cooler"
    },
    {
      "name": "white",
      "light": "#565a63",
      "dark": "#c9dedf",
      "mono-light": "#565656",
      "mono-dark": "#9a9a9a",
      "role": "ANSI 7 — text-muted on Sheet, body-dim on Field"
    },
    {
      "name": "bright-black",
      "light": "#878c95",
      "dark": "#656b76",
      "mono-light": "#7d7d7d",
      "mono-dark": "#6a6a6a",
      "role": "faint"
    },
    {
      "name": "bright-red",
      "light": "#b60000",
      "dark": "#ff7f7f",
      "mono-light": "#2a2a2a",
      "mono-dark": "#ffffff",
      "role": "red-warmer"
    },
    {
      "name": "bright-green",
      "light": "#316500",
      "dark": "#70b900",
      "mono-light": "#6a6a6a",
      "mono-dark": "#a5a5a5",
      "role": "green-warmer"
    },
    {
      "name": "bright-yellow",
      "light": "#6f3e00",
      "dark": "#e0a33a",
      "mono-light": "#000000",
      "mono-dark": "#ffffff",
      "role": "bronze accent (intentional override — ANSI 11)"
    },
    {
      "name": "bright-blue",
      "light": "#3548cf",
      "dark": "#79a8ff",
      "mono-light": "#404040",
      "mono-dark": "#dcdcdc",
      "role": "Modus blue-warmer / contour"
    },
    {
      "name": "bright-magenta",
      "light": "#531ab6",
      "dark": "#b6a0ff",
      "mono-light": "#4a4a4a",
      "mono-dark": "#d5d5d5",
      "role": "Modus magenta-cooler"
    },
    {
      "name": "bright-cyan",
      "light": "#005e8b",
      "dark": "#00d3d0",
      "mono-light": "#555555",
      "mono-dark": "#c0c0c0",
      "role": "Modus cyan"
    },
    {
      "name": "bright-white",
      "light": "#23262e",
      "dark": "#f2f4f8",
      "mono-light": "#1a1a1a",
      "mono-dark": "#f2f2f2",
      "role": "ANSI 15 — text on Sheet, heading on Field"
    }
  ],
  "typography": {
    "display": {
      "family": "Zilla Slab",
      "fallback": "\"Roboto Slab\", Rockwell, Georgia, serif",
      "weight": 700,
      "lineHeight": 1.02,
      "letterSpacing": "-0.01em"
    },
    "body": {
      "family": "Hanken Grotesk",
      "fallback": "Inter, system-ui, -apple-system, \"Segoe UI\", sans-serif",
      "sizeBase": "1.0625rem",
      "lineHeight": 1.6
    },
    "mono": {
      "family": "IBM Plex Mono",
      "fallback": "\"JetBrains Mono\", \"Cascadia Code\", \"Fira Code\", ui-monospace, monospace"
    },
    "heading": {
      "inherits": "display",
      "lineHeight": 1.05,
      "letterSpacing": "-0.01em"
    },
    "label": {
      "inherits": "mono",
      "weight": 500,
      "letterSpacing": "0.1em",
      "transform": "uppercase"
    },
    "tuiFallback": "\"IBM Plex Mono\", \"JetBrains Mono\", Iosevka, \"Fira Mono\", \"DejaVu Sans Mono\", monospace",
    "scale": [
      3.25,
      2,
      1.4,
      1.15,
      1.0625,
      0.95,
      0.9,
      0.875,
      0.85,
      0.8125
    ],
    "scaling": {
      "rootFontSize": "user-agent",
      "readableFloor": "0.9rem",
      "absoluteFloor": "0.8125rem",
      "minRelativeEm": 0.85,
      "fluid": "clamp(<rem-min>, <rem-base> + <vw>, <rem-max>)",
      "targets": {
        "resizeText": "200%",
        "reflowWidth": "320px",
        "reflowZoom": "400%"
      },
      "textSpacing": {
        "lineHeight": 1.5,
        "letterSpacing": "0.12em",
        "wordSpacing": "0.16em",
        "paragraphSpacing": "2em"
      },
      "notes": "Every step is a rem multiple of the user agent's root font size — the system never sets `html { font-size }`. readableFloor is the smallest step allowed for text a user must read; absoluteFloor is the hard floor for glanceable chrome (uppercase mono labels, badges, keycaps, refs). Enforced by scripts/validate-a11y-type.mjs; specified in docs/ACCESSIBILITY.md."
    }
  },
  "spacing": {
    "2xs": "0.125rem",
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem"
  },
  "layout": {
    "contentMax": "72ch",
    "marginWidth": "16rem",
    "gap": "2.5rem",
    "paddingMobile": "1.25rem"
  },
  "radii": {
    "xs": "2px",
    "sm": "3px",
    "md": "4px",
    "pill": "999px"
  },
  "breakpoints": {
    "sm": "40em",
    "md": "53.75em",
    "notes": "em units, resolved against the browser's default font size (never a page `html { font-size }`), so the layout reflows when a user raises their default text size — not only when they zoom. 40em/53.75em are 640px/860px at the 16px default. CSS media queries cannot read custom properties; hand-authored @media rules repeat these values literally and carry a `/* breakpoints.<name> */` comment."
  },
  "zIndex": {
    "base": 0,
    "sticky": 10,
    "scrim": 100,
    "modal": 110,
    "toast": 120,
    "skip": 130,
    "notes": "Semantic layering scale. `skip` sits above everything so skip-links are never buried; scrim/modal/toast are reserved slots for overlay surfaces."
  },
  "borderWidth": {
    "hairline": "1px",
    "focus": "2px",
    "marker": "3px",
    "notes": "hairline = default component border; focus mirrors focus.width (validated); marker = selected-item stripe per platforms/KEYBOARD.md — never a decorative side-stripe."
  },
  "focus": {
    "width": "2px",
    "offset": "2px",
    "notes": "ring stroke + offset; colour is always `accent` (bronze). See platforms/KEYBOARD.md."
  },
  "density": {
    "comfortable": {
      "lineHeight": 1.6,
      "rowPadY": "0.75rem",
      "hitTargetMin": "44px",
      "gapInline": "0.75rem",
      "gapBlock": "1.5rem"
    },
    "compact": {
      "lineHeight": 1.5,
      "rowPadY": "0.375rem",
      "hitTargetMin": "36px",
      "gapInline": "0.5rem",
      "gapBlock": "1rem"
    },
    "tui": {
      "lineHeight": 1.3,
      "rowPadY": "2px",
      "gapInline": "1ch",
      "gapBlock": "1 line"
    }
  },
  "motion": {
    "fast": {
      "duration": "150ms",
      "css": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      "hypr": "0.25,0.1,0.25,1"
    },
    "base": {
      "duration": "250ms",
      "css": "cubic-bezier(0.2, 0.6, 0.2, 1)",
      "hypr": "0.2,0.6,0.2,1"
    },
    "slow": {
      "duration": "300ms",
      "css": "cubic-bezier(0.16, 1, 0.3, 1)",
      "hypr": "0.16,1,0.3,1"
    },
    "survey": {
      "duration": "480ms",
      "css": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "hypr": "0.2,0.8,0.2,1",
      "notes": "the long 'survey renders in' ease — expo-out, no overshoot (the system bans bounce); drives contour-draw / line-extend / readout"
    }
  },
  "sound": {
    "tap": {
      "theme": "bell",
      "meaning": "generic acknowledgement"
    },
    "error": {
      "theme": "dialog-error",
      "meaning": "something went wrong"
    },
    "complete": {
      "theme": "complete",
      "meaning": "long task finished"
    }
  },
  "pairs": {
    "accent": {
      "fg": "bg",
      "min": 4.5,
      "label": "label on the bronze fill — primary button"
    },
    "accent-hover": {
      "fg": "bg",
      "min": 4.5,
      "label": "label on the bronze :hover/:active fill"
    },
    "brand": {
      "fg": "bg",
      "min": 4.5,
      "label": "label on a solid benchmark-vermilion fill"
    },
    "bg-subtle": {
      "fg": "text",
      "min": 7,
      "label": "body on the subtle fill — code, zebra"
    },
    "surface": {
      "fg": "text",
      "min": 7,
      "label": "body on a card surface"
    },
    "surface-raised": {
      "fg": "text",
      "min": 7,
      "label": "body on a raised plate / modal / dropdown"
    },
    "selection-bg": {
      "fg": "text",
      "min": 7,
      "label": "selected text on the selection highlight"
    }
  },
  "contrast": [
    {
      "fg": "text",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA body text (Sheet)"
    },
    {
      "fg": "text",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA body text (Field)"
    },
    {
      "fg": "text-heading",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA headings (Sheet)"
    },
    {
      "fg": "text-heading",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA headings (Field)"
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA meta (Sheet)"
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA meta (Field)"
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA bronze accent (Sheet)"
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA bronze accent (Field)"
    },
    {
      "fg": "contour",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA contour blue (Sheet)"
    },
    {
      "fg": "contour",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA contour blue (Field)"
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA syn-keyword (Sheet)"
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-keyword (Field)"
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-string (Sheet) — Modus blue-warmer verbatim, 6.63:1 on the cool ground"
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-string (Field)"
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA syn-function (Sheet)"
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-function (Field)"
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA syn-type (Sheet)"
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-type (Field)"
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-number (Sheet)"
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-number (Field)"
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-builtin (Sheet)"
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-builtin (Field)"
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-variable (Sheet)"
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-variable (Field)"
    },
    {
      "fg": "syn-comment",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-comment (Sheet)"
    },
    {
      "fg": "syn-comment",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-comment (Field)"
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-docstring (Sheet)"
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-docstring (Field)"
    },
    {
      "fg": "text",
      "bg": "bg",
      "mode": "mono-light",
      "min": 7,
      "label": "AAA body text (Chalk)"
    },
    {
      "fg": "text",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 7,
      "label": "AAA body text (Graphite)"
    },
    {
      "fg": "text-heading",
      "bg": "bg",
      "mode": "mono-light",
      "min": 7,
      "label": "AAA headings (Chalk)"
    },
    {
      "fg": "text-heading",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 7,
      "label": "AAA headings (Graphite)"
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA meta (Chalk)"
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 4.5,
      "label": "AA meta (Graphite)"
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "mono-light",
      "min": 7,
      "label": "AAA ink accent (Chalk)"
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 7,
      "label": "AAA ink accent (Graphite)"
    },
    {
      "fg": "contour",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA contour line (Chalk)"
    },
    {
      "fg": "contour",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 4.5,
      "label": "AA contour line (Graphite)"
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "mono-light",
      "min": 7,
      "label": "AAA syn-keyword (Chalk)"
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 7,
      "label": "AAA syn-keyword (Graphite)"
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA syn-string (Chalk)"
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 7,
      "label": "AAA syn-string (Graphite)"
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "mono-light",
      "min": 7,
      "label": "AAA syn-function (Chalk)"
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 7,
      "label": "AAA syn-function (Graphite)"
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "mono-light",
      "min": 7,
      "label": "AAA syn-type (Chalk)"
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 7,
      "label": "AAA syn-type (Graphite)"
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA syn-number (Chalk)"
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 4.5,
      "label": "AA syn-number (Graphite)"
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA syn-builtin (Chalk)"
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 4.5,
      "label": "AA syn-builtin (Graphite)"
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA syn-variable (Chalk)"
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 4.5,
      "label": "AA syn-variable (Graphite)"
    },
    {
      "fg": "syn-comment",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA syn-comment (Chalk)"
    },
    {
      "fg": "syn-comment",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 4.5,
      "label": "AA syn-comment (Graphite)"
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "mono-light",
      "min": 4.5,
      "label": "AA syn-docstring (Chalk)"
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "mono-dark",
      "min": 4.5,
      "label": "AA syn-docstring (Graphite)"
    }
  ],
  "contrastPairs": [
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "bg",
      "fgHex": "#12141a",
      "bgHex": "#f6f8fb",
      "ratio": 17.3,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "bg-subtle",
      "fgHex": "#12141a",
      "bgHex": "#eef2f6",
      "ratio": 16.36,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "surface",
      "fgHex": "#12141a",
      "bgHex": "#e6ecf1",
      "ratio": 15.46,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "surface-raised",
      "fgHex": "#12141a",
      "bgHex": "#fcfdff",
      "ratio": 18.09,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "scrim",
      "fgHex": "#12141a",
      "bgHex": "#14171e",
      "ratio": 1.03,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "bg",
      "fgHex": "#23262e",
      "bgHex": "#f6f8fb",
      "ratio": 14.22,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "bg-subtle",
      "fgHex": "#23262e",
      "bgHex": "#eef2f6",
      "ratio": 13.45,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "surface",
      "fgHex": "#23262e",
      "bgHex": "#e6ecf1",
      "ratio": 12.7,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "surface-raised",
      "fgHex": "#23262e",
      "bgHex": "#fcfdff",
      "ratio": 14.86,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "scrim",
      "fgHex": "#23262e",
      "bgHex": "#14171e",
      "ratio": 1.19,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "bg",
      "fgHex": "#565a63",
      "bgHex": "#f6f8fb",
      "ratio": 6.5,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "bg-subtle",
      "fgHex": "#565a63",
      "bgHex": "#eef2f6",
      "ratio": 6.14,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "surface",
      "fgHex": "#565a63",
      "bgHex": "#e6ecf1",
      "ratio": 5.8,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "surface-raised",
      "fgHex": "#565a63",
      "bgHex": "#fcfdff",
      "ratio": 6.79,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "scrim",
      "fgHex": "#565a63",
      "bgHex": "#14171e",
      "ratio": 2.59,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "bg",
      "fgHex": "#878c95",
      "bgHex": "#f6f8fb",
      "ratio": 3.18,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "bg-subtle",
      "fgHex": "#878c95",
      "bgHex": "#eef2f6",
      "ratio": 3,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "surface",
      "fgHex": "#878c95",
      "bgHex": "#e6ecf1",
      "ratio": 2.84,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "surface-raised",
      "fgHex": "#878c95",
      "bgHex": "#fcfdff",
      "ratio": 3.32,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "scrim",
      "fgHex": "#878c95",
      "bgHex": "#14171e",
      "ratio": 5.31,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "bg",
      "fgHex": "#6f3e00",
      "bgHex": "#f6f8fb",
      "ratio": 8.35,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "bg-subtle",
      "fgHex": "#6f3e00",
      "bgHex": "#eef2f6",
      "ratio": 7.89,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "surface",
      "fgHex": "#6f3e00",
      "bgHex": "#e6ecf1",
      "ratio": 7.46,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "surface-raised",
      "fgHex": "#6f3e00",
      "bgHex": "#fcfdff",
      "ratio": 8.72,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "scrim",
      "fgHex": "#6f3e00",
      "bgHex": "#14171e",
      "ratio": 2.02,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "bg",
      "fgHex": "#8a4d00",
      "bgHex": "#f6f8fb",
      "ratio": 6.28,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "bg-subtle",
      "fgHex": "#8a4d00",
      "bgHex": "#eef2f6",
      "ratio": 5.94,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "surface",
      "fgHex": "#8a4d00",
      "bgHex": "#e6ecf1",
      "ratio": 5.61,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "surface-raised",
      "fgHex": "#8a4d00",
      "bgHex": "#fcfdff",
      "ratio": 6.57,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "scrim",
      "fgHex": "#8a4d00",
      "bgHex": "#14171e",
      "ratio": 2.68,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "bg",
      "fgHex": "#b5450e",
      "bgHex": "#f6f8fb",
      "ratio": 5.16,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "bg-subtle",
      "fgHex": "#b5450e",
      "bgHex": "#eef2f6",
      "ratio": 4.88,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "surface",
      "fgHex": "#b5450e",
      "bgHex": "#e6ecf1",
      "ratio": 4.61,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "surface-raised",
      "fgHex": "#b5450e",
      "bgHex": "#fcfdff",
      "ratio": 5.4,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "scrim",
      "fgHex": "#b5450e",
      "bgHex": "#14171e",
      "ratio": 3.26,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "bg",
      "fgHex": "#e6e2dd",
      "bgHex": "#f6f8fb",
      "ratio": 1.21,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "bg-subtle",
      "fgHex": "#e6e2dd",
      "bgHex": "#eef2f6",
      "ratio": 1.15,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "surface",
      "fgHex": "#e6e2dd",
      "bgHex": "#e6ecf1",
      "ratio": 1.08,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "surface-raised",
      "fgHex": "#e6e2dd",
      "bgHex": "#fcfdff",
      "ratio": 1.27,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "scrim",
      "fgHex": "#e6e2dd",
      "bgHex": "#14171e",
      "ratio": 13.91,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "bg",
      "fgHex": "#ece0cf",
      "bgHex": "#f6f8fb",
      "ratio": 1.22,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "bg-subtle",
      "fgHex": "#ece0cf",
      "bgHex": "#eef2f6",
      "ratio": 1.16,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "surface",
      "fgHex": "#ece0cf",
      "bgHex": "#e6ecf1",
      "ratio": 1.09,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "surface-raised",
      "fgHex": "#ece0cf",
      "bgHex": "#fcfdff",
      "ratio": 1.28,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "scrim",
      "fgHex": "#ece0cf",
      "bgHex": "#14171e",
      "ratio": 13.77,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "bg",
      "fgHex": "#6f3e00",
      "bgHex": "#f6f8fb",
      "ratio": 8.35,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "bg-subtle",
      "fgHex": "#6f3e00",
      "bgHex": "#eef2f6",
      "ratio": 7.89,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "surface",
      "fgHex": "#6f3e00",
      "bgHex": "#e6ecf1",
      "ratio": 7.46,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "surface-raised",
      "fgHex": "#6f3e00",
      "bgHex": "#fcfdff",
      "ratio": 8.72,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "scrim",
      "fgHex": "#6f3e00",
      "bgHex": "#14171e",
      "ratio": 2.02,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "bg",
      "fgHex": "#a60000",
      "bgHex": "#f6f8fb",
      "ratio": 7.53,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "bg-subtle",
      "fgHex": "#a60000",
      "bgHex": "#eef2f6",
      "ratio": 7.12,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "surface",
      "fgHex": "#a60000",
      "bgHex": "#e6ecf1",
      "ratio": 6.73,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "surface-raised",
      "fgHex": "#a60000",
      "bgHex": "#fcfdff",
      "ratio": 7.87,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "scrim",
      "fgHex": "#a60000",
      "bgHex": "#14171e",
      "ratio": 2.24,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "bg",
      "fgHex": "#884900",
      "bgHex": "#f6f8fb",
      "ratio": 6.58,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "bg-subtle",
      "fgHex": "#884900",
      "bgHex": "#eef2f6",
      "ratio": 6.22,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "surface",
      "fgHex": "#884900",
      "bgHex": "#e6ecf1",
      "ratio": 5.88,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "surface-raised",
      "fgHex": "#884900",
      "bgHex": "#fcfdff",
      "ratio": 6.88,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "scrim",
      "fgHex": "#884900",
      "bgHex": "#14171e",
      "ratio": 2.56,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "bg",
      "fgHex": "#006800",
      "bgHex": "#f6f8fb",
      "ratio": 6.62,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "bg-subtle",
      "fgHex": "#006800",
      "bgHex": "#eef2f6",
      "ratio": 6.26,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "surface",
      "fgHex": "#006800",
      "bgHex": "#e6ecf1",
      "ratio": 5.92,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "surface-raised",
      "fgHex": "#006800",
      "bgHex": "#fcfdff",
      "ratio": 6.92,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "scrim",
      "fgHex": "#006800",
      "bgHex": "#14171e",
      "ratio": 2.54,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "bg",
      "fgHex": "#005e8b",
      "bgHex": "#f6f8fb",
      "ratio": 6.64,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "bg-subtle",
      "fgHex": "#005e8b",
      "bgHex": "#eef2f6",
      "ratio": 6.28,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "surface",
      "fgHex": "#005e8b",
      "bgHex": "#e6ecf1",
      "ratio": 5.93,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "surface-raised",
      "fgHex": "#005e8b",
      "bgHex": "#fcfdff",
      "ratio": 6.94,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "scrim",
      "fgHex": "#005e8b",
      "bgHex": "#14171e",
      "ratio": 2.54,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "bg",
      "fgHex": "#f2f4f8",
      "bgHex": "#0d0f14",
      "ratio": 17.41,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "bg-subtle",
      "fgHex": "#f2f4f8",
      "bgHex": "#14171e",
      "ratio": 16.29,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "surface",
      "fgHex": "#f2f4f8",
      "bgHex": "#1b1f28",
      "ratio": 14.98,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "surface-raised",
      "fgHex": "#f2f4f8",
      "bgHex": "#232833",
      "ratio": 13.4,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "scrim",
      "fgHex": "#f2f4f8",
      "bgHex": "#05060a",
      "ratio": 18.39,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "bg",
      "fgHex": "#d6dae2",
      "bgHex": "#0d0f14",
      "ratio": 13.68,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "bg-subtle",
      "fgHex": "#d6dae2",
      "bgHex": "#14171e",
      "ratio": 12.8,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "surface",
      "fgHex": "#d6dae2",
      "bgHex": "#1b1f28",
      "ratio": 11.77,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "surface-raised",
      "fgHex": "#d6dae2",
      "bgHex": "#232833",
      "ratio": 10.53,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "scrim",
      "fgHex": "#d6dae2",
      "bgHex": "#05060a",
      "ratio": 14.45,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "bg",
      "fgHex": "#9aa0ab",
      "bgHex": "#0d0f14",
      "ratio": 7.29,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "bg-subtle",
      "fgHex": "#9aa0ab",
      "bgHex": "#14171e",
      "ratio": 6.82,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "surface",
      "fgHex": "#9aa0ab",
      "bgHex": "#1b1f28",
      "ratio": 6.28,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "surface-raised",
      "fgHex": "#9aa0ab",
      "bgHex": "#232833",
      "ratio": 5.62,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "scrim",
      "fgHex": "#9aa0ab",
      "bgHex": "#05060a",
      "ratio": 7.71,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "bg",
      "fgHex": "#656b76",
      "bgHex": "#0d0f14",
      "ratio": 3.58,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "bg-subtle",
      "fgHex": "#656b76",
      "bgHex": "#14171e",
      "ratio": 3.35,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "surface",
      "fgHex": "#656b76",
      "bgHex": "#1b1f28",
      "ratio": 3.08,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "surface-raised",
      "fgHex": "#656b76",
      "bgHex": "#232833",
      "ratio": 2.75,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "scrim",
      "fgHex": "#656b76",
      "bgHex": "#05060a",
      "ratio": 3.78,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "bg",
      "fgHex": "#e0a33a",
      "bgHex": "#0d0f14",
      "ratio": 8.64,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "bg-subtle",
      "fgHex": "#e0a33a",
      "bgHex": "#14171e",
      "ratio": 8.09,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "surface",
      "fgHex": "#e0a33a",
      "bgHex": "#1b1f28",
      "ratio": 7.44,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "surface-raised",
      "fgHex": "#e0a33a",
      "bgHex": "#232833",
      "ratio": 6.66,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "scrim",
      "fgHex": "#e0a33a",
      "bgHex": "#05060a",
      "ratio": 9.13,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "bg",
      "fgHex": "#f0b95c",
      "bgHex": "#0d0f14",
      "ratio": 10.77,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "bg-subtle",
      "fgHex": "#f0b95c",
      "bgHex": "#14171e",
      "ratio": 10.08,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "surface",
      "fgHex": "#f0b95c",
      "bgHex": "#1b1f28",
      "ratio": 9.27,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "surface-raised",
      "fgHex": "#f0b95c",
      "bgHex": "#232833",
      "ratio": 8.29,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "scrim",
      "fgHex": "#f0b95c",
      "bgHex": "#05060a",
      "ratio": 11.38,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "bg",
      "fgHex": "#ef8a4a",
      "bgHex": "#0d0f14",
      "ratio": 7.67,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "bg-subtle",
      "fgHex": "#ef8a4a",
      "bgHex": "#14171e",
      "ratio": 7.18,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "surface",
      "fgHex": "#ef8a4a",
      "bgHex": "#1b1f28",
      "ratio": 6.6,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "surface-raised",
      "fgHex": "#ef8a4a",
      "bgHex": "#232833",
      "ratio": 5.91,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "scrim",
      "fgHex": "#ef8a4a",
      "bgHex": "#05060a",
      "ratio": 8.11,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "bg",
      "fgHex": "#262119",
      "bgHex": "#0d0f14",
      "ratio": 1.2,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "bg-subtle",
      "fgHex": "#262119",
      "bgHex": "#14171e",
      "ratio": 1.12,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "surface",
      "fgHex": "#262119",
      "bgHex": "#1b1f28",
      "ratio": 1.03,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "surface-raised",
      "fgHex": "#262119",
      "bgHex": "#232833",
      "ratio": 1.08,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "scrim",
      "fgHex": "#262119",
      "bgHex": "#05060a",
      "ratio": 1.27,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "bg",
      "fgHex": "#3a2f1c",
      "bgHex": "#0d0f14",
      "ratio": 1.46,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "bg-subtle",
      "fgHex": "#3a2f1c",
      "bgHex": "#14171e",
      "ratio": 1.37,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "surface",
      "fgHex": "#3a2f1c",
      "bgHex": "#1b1f28",
      "ratio": 1.26,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "surface-raised",
      "fgHex": "#3a2f1c",
      "bgHex": "#232833",
      "ratio": 1.13,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "scrim",
      "fgHex": "#3a2f1c",
      "bgHex": "#05060a",
      "ratio": 1.55,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "bg",
      "fgHex": "#e0a33a",
      "bgHex": "#0d0f14",
      "ratio": 8.64,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "bg-subtle",
      "fgHex": "#e0a33a",
      "bgHex": "#14171e",
      "ratio": 8.09,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "surface",
      "fgHex": "#e0a33a",
      "bgHex": "#1b1f28",
      "ratio": 7.44,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "surface-raised",
      "fgHex": "#e0a33a",
      "bgHex": "#232833",
      "ratio": 6.66,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "scrim",
      "fgHex": "#e0a33a",
      "bgHex": "#05060a",
      "ratio": 9.13,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "bg",
      "fgHex": "#f0685f",
      "bgHex": "#0d0f14",
      "ratio": 6.25,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "bg-subtle",
      "fgHex": "#f0685f",
      "bgHex": "#14171e",
      "ratio": 5.85,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "surface",
      "fgHex": "#f0685f",
      "bgHex": "#1b1f28",
      "ratio": 5.38,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "surface-raised",
      "fgHex": "#f0685f",
      "bgHex": "#232833",
      "ratio": 4.81,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "scrim",
      "fgHex": "#f0685f",
      "bgHex": "#05060a",
      "ratio": 6.61,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "bg",
      "fgHex": "#d9b34a",
      "bgHex": "#0d0f14",
      "ratio": 9.58,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "bg-subtle",
      "fgHex": "#d9b34a",
      "bgHex": "#14171e",
      "ratio": 8.96,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "surface",
      "fgHex": "#d9b34a",
      "bgHex": "#1b1f28",
      "ratio": 8.24,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "surface-raised",
      "fgHex": "#d9b34a",
      "bgHex": "#232833",
      "ratio": 7.38,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "scrim",
      "fgHex": "#d9b34a",
      "bgHex": "#05060a",
      "ratio": 10.12,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "bg",
      "fgHex": "#6bbf6b",
      "bgHex": "#0d0f14",
      "ratio": 8.48,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "bg-subtle",
      "fgHex": "#6bbf6b",
      "bgHex": "#14171e",
      "ratio": 7.93,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "surface",
      "fgHex": "#6bbf6b",
      "bgHex": "#1b1f28",
      "ratio": 7.3,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "surface-raised",
      "fgHex": "#6bbf6b",
      "bgHex": "#232833",
      "ratio": 6.53,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "scrim",
      "fgHex": "#6bbf6b",
      "bgHex": "#05060a",
      "ratio": 8.96,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "bg",
      "fgHex": "#5fb8cf",
      "bgHex": "#0d0f14",
      "ratio": 8.44,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "bg-subtle",
      "fgHex": "#5fb8cf",
      "bgHex": "#14171e",
      "ratio": 7.89,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "surface",
      "fgHex": "#5fb8cf",
      "bgHex": "#1b1f28",
      "ratio": 7.26,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "surface-raised",
      "fgHex": "#5fb8cf",
      "bgHex": "#232833",
      "ratio": 6.5,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "scrim",
      "fgHex": "#5fb8cf",
      "bgHex": "#05060a",
      "ratio": 8.91,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text-heading",
      "bg": "bg",
      "fgHex": "#1a1a1a",
      "bgHex": "#f4f4f4",
      "ratio": 15.82,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text-heading",
      "bg": "bg-subtle",
      "fgHex": "#1a1a1a",
      "bgHex": "#ececec",
      "ratio": 14.73,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text-heading",
      "bg": "surface",
      "fgHex": "#1a1a1a",
      "bgHex": "#e2e2e2",
      "ratio": 13.43,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text-heading",
      "bg": "surface-raised",
      "fgHex": "#1a1a1a",
      "bgHex": "#fcfcfc",
      "ratio": 16.96,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text-heading",
      "bg": "scrim",
      "fgHex": "#1a1a1a",
      "bgHex": "#141414",
      "ratio": 1.06,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "text",
      "bg": "bg",
      "fgHex": "#2b2b2b",
      "bgHex": "#f4f4f4",
      "ratio": 12.87,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text",
      "bg": "bg-subtle",
      "fgHex": "#2b2b2b",
      "bgHex": "#ececec",
      "ratio": 11.99,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text",
      "bg": "surface",
      "fgHex": "#2b2b2b",
      "bgHex": "#e2e2e2",
      "ratio": 10.93,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text",
      "bg": "surface-raised",
      "fgHex": "#2b2b2b",
      "bgHex": "#fcfcfc",
      "ratio": 13.8,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text",
      "bg": "scrim",
      "fgHex": "#2b2b2b",
      "bgHex": "#141414",
      "ratio": 1.3,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "text-muted",
      "bg": "bg",
      "fgHex": "#565656",
      "bgHex": "#f4f4f4",
      "ratio": 6.67,
      "tag": "AA"
    },
    {
      "mode": "mono-light",
      "fg": "text-muted",
      "bg": "bg-subtle",
      "fgHex": "#565656",
      "bgHex": "#ececec",
      "ratio": 6.21,
      "tag": "AA"
    },
    {
      "mode": "mono-light",
      "fg": "text-muted",
      "bg": "surface",
      "fgHex": "#565656",
      "bgHex": "#e2e2e2",
      "ratio": 5.67,
      "tag": "AA"
    },
    {
      "mode": "mono-light",
      "fg": "text-muted",
      "bg": "surface-raised",
      "fgHex": "#565656",
      "bgHex": "#fcfcfc",
      "ratio": 7.15,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "text-muted",
      "bg": "scrim",
      "fgHex": "#565656",
      "bgHex": "#141414",
      "ratio": 2.51,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "text-faint",
      "bg": "bg",
      "fgHex": "#7d7d7d",
      "bgHex": "#f4f4f4",
      "ratio": 3.74,
      "tag": "AA Large"
    },
    {
      "mode": "mono-light",
      "fg": "text-faint",
      "bg": "bg-subtle",
      "fgHex": "#7d7d7d",
      "bgHex": "#ececec",
      "ratio": 3.48,
      "tag": "AA Large"
    },
    {
      "mode": "mono-light",
      "fg": "text-faint",
      "bg": "surface",
      "fgHex": "#7d7d7d",
      "bgHex": "#e2e2e2",
      "ratio": 3.18,
      "tag": "AA Large"
    },
    {
      "mode": "mono-light",
      "fg": "text-faint",
      "bg": "surface-raised",
      "fgHex": "#7d7d7d",
      "bgHex": "#fcfcfc",
      "ratio": 4.01,
      "tag": "AA Large"
    },
    {
      "mode": "mono-light",
      "fg": "text-faint",
      "bg": "scrim",
      "fgHex": "#7d7d7d",
      "bgHex": "#141414",
      "ratio": 4.48,
      "tag": "AA Large"
    },
    {
      "mode": "mono-light",
      "fg": "accent",
      "bg": "bg",
      "fgHex": "#000000",
      "bgHex": "#f4f4f4",
      "ratio": 19.09,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent",
      "bg": "bg-subtle",
      "fgHex": "#000000",
      "bgHex": "#ececec",
      "ratio": 17.78,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent",
      "bg": "surface",
      "fgHex": "#000000",
      "bgHex": "#e2e2e2",
      "ratio": 16.21,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent",
      "bg": "surface-raised",
      "fgHex": "#000000",
      "bgHex": "#fcfcfc",
      "ratio": 20.47,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent",
      "bg": "scrim",
      "fgHex": "#000000",
      "bgHex": "#141414",
      "ratio": 1.14,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "accent-hover",
      "bg": "bg",
      "fgHex": "#333333",
      "bgHex": "#f4f4f4",
      "ratio": 11.49,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent-hover",
      "bg": "bg-subtle",
      "fgHex": "#333333",
      "bgHex": "#ececec",
      "ratio": 10.69,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent-hover",
      "bg": "surface",
      "fgHex": "#333333",
      "bgHex": "#e2e2e2",
      "ratio": 9.75,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent-hover",
      "bg": "surface-raised",
      "fgHex": "#333333",
      "bgHex": "#fcfcfc",
      "ratio": 12.32,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "accent-hover",
      "bg": "scrim",
      "fgHex": "#333333",
      "bgHex": "#141414",
      "ratio": 1.46,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "brand",
      "bg": "bg",
      "fgHex": "#3a3a3a",
      "bgHex": "#f4f4f4",
      "ratio": 10.34,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "brand",
      "bg": "bg-subtle",
      "fgHex": "#3a3a3a",
      "bgHex": "#ececec",
      "ratio": 9.63,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "brand",
      "bg": "surface",
      "fgHex": "#3a3a3a",
      "bgHex": "#e2e2e2",
      "ratio": 8.78,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "brand",
      "bg": "surface-raised",
      "fgHex": "#3a3a3a",
      "bgHex": "#fcfcfc",
      "ratio": 11.09,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "brand",
      "bg": "scrim",
      "fgHex": "#3a3a3a",
      "bgHex": "#141414",
      "ratio": 1.62,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "accent-subtle",
      "bg": "bg",
      "fgHex": "#dcdcdc",
      "bgHex": "#f4f4f4",
      "ratio": 1.25,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "accent-subtle",
      "bg": "bg-subtle",
      "fgHex": "#dcdcdc",
      "bgHex": "#ececec",
      "ratio": 1.16,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "accent-subtle",
      "bg": "surface",
      "fgHex": "#dcdcdc",
      "bgHex": "#e2e2e2",
      "ratio": 1.06,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "accent-subtle",
      "bg": "surface-raised",
      "fgHex": "#dcdcdc",
      "bgHex": "#fcfcfc",
      "ratio": 1.34,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "accent-subtle",
      "bg": "scrim",
      "fgHex": "#dcdcdc",
      "bgHex": "#141414",
      "ratio": 13.43,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "selection-bg",
      "bg": "bg",
      "fgHex": "#c8c8c8",
      "bgHex": "#f4f4f4",
      "ratio": 1.52,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "selection-bg",
      "bg": "bg-subtle",
      "fgHex": "#c8c8c8",
      "bgHex": "#ececec",
      "ratio": 1.42,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "selection-bg",
      "bg": "surface",
      "fgHex": "#c8c8c8",
      "bgHex": "#e2e2e2",
      "ratio": 1.29,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "selection-bg",
      "bg": "surface-raised",
      "fgHex": "#c8c8c8",
      "bgHex": "#fcfcfc",
      "ratio": 1.63,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "selection-bg",
      "bg": "scrim",
      "fgHex": "#c8c8c8",
      "bgHex": "#141414",
      "ratio": 11.01,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "cursor",
      "bg": "bg",
      "fgHex": "#000000",
      "bgHex": "#f4f4f4",
      "ratio": 19.09,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "cursor",
      "bg": "bg-subtle",
      "fgHex": "#000000",
      "bgHex": "#ececec",
      "ratio": 17.78,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "cursor",
      "bg": "surface",
      "fgHex": "#000000",
      "bgHex": "#e2e2e2",
      "ratio": 16.21,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "cursor",
      "bg": "surface-raised",
      "fgHex": "#000000",
      "bgHex": "#fcfcfc",
      "ratio": 20.47,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "cursor",
      "bg": "scrim",
      "fgHex": "#000000",
      "bgHex": "#141414",
      "ratio": 1.14,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "status-err",
      "bg": "bg",
      "fgHex": "#1f1f1f",
      "bgHex": "#f4f4f4",
      "ratio": 14.99,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-err",
      "bg": "bg-subtle",
      "fgHex": "#1f1f1f",
      "bgHex": "#ececec",
      "ratio": 13.95,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-err",
      "bg": "surface",
      "fgHex": "#1f1f1f",
      "bgHex": "#e2e2e2",
      "ratio": 12.72,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-err",
      "bg": "surface-raised",
      "fgHex": "#1f1f1f",
      "bgHex": "#fcfcfc",
      "ratio": 16.07,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-err",
      "bg": "scrim",
      "fgHex": "#1f1f1f",
      "bgHex": "#141414",
      "ratio": 1.12,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "status-warn",
      "bg": "bg",
      "fgHex": "#454545",
      "bgHex": "#f4f4f4",
      "ratio": 8.72,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-warn",
      "bg": "bg-subtle",
      "fgHex": "#454545",
      "bgHex": "#ececec",
      "ratio": 8.12,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-warn",
      "bg": "surface",
      "fgHex": "#454545",
      "bgHex": "#e2e2e2",
      "ratio": 7.4,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-warn",
      "bg": "surface-raised",
      "fgHex": "#454545",
      "bgHex": "#fcfcfc",
      "ratio": 9.35,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-warn",
      "bg": "scrim",
      "fgHex": "#454545",
      "bgHex": "#141414",
      "ratio": 1.92,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "status-ok",
      "bg": "bg",
      "fgHex": "#565656",
      "bgHex": "#f4f4f4",
      "ratio": 6.67,
      "tag": "AA"
    },
    {
      "mode": "mono-light",
      "fg": "status-ok",
      "bg": "bg-subtle",
      "fgHex": "#565656",
      "bgHex": "#ececec",
      "ratio": 6.21,
      "tag": "AA"
    },
    {
      "mode": "mono-light",
      "fg": "status-ok",
      "bg": "surface",
      "fgHex": "#565656",
      "bgHex": "#e2e2e2",
      "ratio": 5.67,
      "tag": "AA"
    },
    {
      "mode": "mono-light",
      "fg": "status-ok",
      "bg": "surface-raised",
      "fgHex": "#565656",
      "bgHex": "#fcfcfc",
      "ratio": 7.15,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-ok",
      "bg": "scrim",
      "fgHex": "#565656",
      "bgHex": "#141414",
      "ratio": 2.51,
      "tag": "fail"
    },
    {
      "mode": "mono-light",
      "fg": "status-info",
      "bg": "bg",
      "fgHex": "#333333",
      "bgHex": "#f4f4f4",
      "ratio": 11.49,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-info",
      "bg": "bg-subtle",
      "fgHex": "#333333",
      "bgHex": "#ececec",
      "ratio": 10.69,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-info",
      "bg": "surface",
      "fgHex": "#333333",
      "bgHex": "#e2e2e2",
      "ratio": 9.75,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-info",
      "bg": "surface-raised",
      "fgHex": "#333333",
      "bgHex": "#fcfcfc",
      "ratio": 12.32,
      "tag": "AAA"
    },
    {
      "mode": "mono-light",
      "fg": "status-info",
      "bg": "scrim",
      "fgHex": "#333333",
      "bgHex": "#141414",
      "ratio": 1.46,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "text-heading",
      "bg": "bg",
      "fgHex": "#f2f2f2",
      "bgHex": "#0d0d0d",
      "ratio": 17.36,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-heading",
      "bg": "bg-subtle",
      "fgHex": "#f2f2f2",
      "bgHex": "#161616",
      "ratio": 16.16,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-heading",
      "bg": "surface",
      "fgHex": "#f2f2f2",
      "bgHex": "#1f1f1f",
      "ratio": 14.72,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-heading",
      "bg": "surface-raised",
      "fgHex": "#f2f2f2",
      "bgHex": "#282828",
      "ratio": 13.17,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-heading",
      "bg": "scrim",
      "fgHex": "#f2f2f2",
      "bgHex": "#050505",
      "ratio": 18.21,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text",
      "bg": "bg",
      "fgHex": "#dadada",
      "bgHex": "#0d0d0d",
      "ratio": 13.9,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text",
      "bg": "bg-subtle",
      "fgHex": "#dadada",
      "bgHex": "#161616",
      "ratio": 12.94,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text",
      "bg": "surface",
      "fgHex": "#dadada",
      "bgHex": "#1f1f1f",
      "ratio": 11.79,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text",
      "bg": "surface-raised",
      "fgHex": "#dadada",
      "bgHex": "#282828",
      "ratio": 10.55,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text",
      "bg": "scrim",
      "fgHex": "#dadada",
      "bgHex": "#050505",
      "ratio": 14.58,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-muted",
      "bg": "bg",
      "fgHex": "#9a9a9a",
      "bgHex": "#0d0d0d",
      "ratio": 6.91,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-muted",
      "bg": "bg-subtle",
      "fgHex": "#9a9a9a",
      "bgHex": "#161616",
      "ratio": 6.43,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-muted",
      "bg": "surface",
      "fgHex": "#9a9a9a",
      "bgHex": "#1f1f1f",
      "ratio": 5.86,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-muted",
      "bg": "surface-raised",
      "fgHex": "#9a9a9a",
      "bgHex": "#282828",
      "ratio": 5.24,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-muted",
      "bg": "scrim",
      "fgHex": "#9a9a9a",
      "bgHex": "#050505",
      "ratio": 7.24,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "text-faint",
      "bg": "bg",
      "fgHex": "#6a6a6a",
      "bgHex": "#0d0d0d",
      "ratio": 3.59,
      "tag": "AA Large"
    },
    {
      "mode": "mono-dark",
      "fg": "text-faint",
      "bg": "bg-subtle",
      "fgHex": "#6a6a6a",
      "bgHex": "#161616",
      "ratio": 3.35,
      "tag": "AA Large"
    },
    {
      "mode": "mono-dark",
      "fg": "text-faint",
      "bg": "surface",
      "fgHex": "#6a6a6a",
      "bgHex": "#1f1f1f",
      "ratio": 3.05,
      "tag": "AA Large"
    },
    {
      "mode": "mono-dark",
      "fg": "text-faint",
      "bg": "surface-raised",
      "fgHex": "#6a6a6a",
      "bgHex": "#282828",
      "ratio": 2.73,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "text-faint",
      "bg": "scrim",
      "fgHex": "#6a6a6a",
      "bgHex": "#050505",
      "ratio": 3.77,
      "tag": "AA Large"
    },
    {
      "mode": "mono-dark",
      "fg": "accent",
      "bg": "bg",
      "fgHex": "#ffffff",
      "bgHex": "#0d0d0d",
      "ratio": 19.44,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent",
      "bg": "bg-subtle",
      "fgHex": "#ffffff",
      "bgHex": "#161616",
      "ratio": 18.1,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent",
      "bg": "surface",
      "fgHex": "#ffffff",
      "bgHex": "#1f1f1f",
      "ratio": 16.48,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent",
      "bg": "surface-raised",
      "fgHex": "#ffffff",
      "bgHex": "#282828",
      "ratio": 14.74,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent",
      "bg": "scrim",
      "fgHex": "#ffffff",
      "bgHex": "#050505",
      "ratio": 20.38,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-hover",
      "bg": "bg",
      "fgHex": "#dcdcdc",
      "bgHex": "#0d0d0d",
      "ratio": 14.17,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-hover",
      "bg": "bg-subtle",
      "fgHex": "#dcdcdc",
      "bgHex": "#161616",
      "ratio": 13.2,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-hover",
      "bg": "surface",
      "fgHex": "#dcdcdc",
      "bgHex": "#1f1f1f",
      "ratio": 12.02,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-hover",
      "bg": "surface-raised",
      "fgHex": "#dcdcdc",
      "bgHex": "#282828",
      "ratio": 10.75,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-hover",
      "bg": "scrim",
      "fgHex": "#dcdcdc",
      "bgHex": "#050505",
      "ratio": 14.86,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "brand",
      "bg": "bg",
      "fgHex": "#e8e8e8",
      "bgHex": "#0d0d0d",
      "ratio": 15.86,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "brand",
      "bg": "bg-subtle",
      "fgHex": "#e8e8e8",
      "bgHex": "#161616",
      "ratio": 14.77,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "brand",
      "bg": "surface",
      "fgHex": "#e8e8e8",
      "bgHex": "#1f1f1f",
      "ratio": 13.45,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "brand",
      "bg": "surface-raised",
      "fgHex": "#e8e8e8",
      "bgHex": "#282828",
      "ratio": 12.03,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "brand",
      "bg": "scrim",
      "fgHex": "#e8e8e8",
      "bgHex": "#050505",
      "ratio": 16.63,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-subtle",
      "bg": "bg",
      "fgHex": "#242424",
      "bgHex": "#0d0d0d",
      "ratio": 1.25,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-subtle",
      "bg": "bg-subtle",
      "fgHex": "#242424",
      "bgHex": "#161616",
      "ratio": 1.17,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-subtle",
      "bg": "surface",
      "fgHex": "#242424",
      "bgHex": "#1f1f1f",
      "ratio": 1.06,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-subtle",
      "bg": "surface-raised",
      "fgHex": "#242424",
      "bgHex": "#282828",
      "ratio": 1.05,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "accent-subtle",
      "bg": "scrim",
      "fgHex": "#242424",
      "bgHex": "#050505",
      "ratio": 1.31,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "selection-bg",
      "bg": "bg",
      "fgHex": "#3a3a3a",
      "bgHex": "#0d0d0d",
      "ratio": 1.71,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "selection-bg",
      "bg": "bg-subtle",
      "fgHex": "#3a3a3a",
      "bgHex": "#161616",
      "ratio": 1.59,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "selection-bg",
      "bg": "surface",
      "fgHex": "#3a3a3a",
      "bgHex": "#1f1f1f",
      "ratio": 1.45,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "selection-bg",
      "bg": "surface-raised",
      "fgHex": "#3a3a3a",
      "bgHex": "#282828",
      "ratio": 1.3,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "selection-bg",
      "bg": "scrim",
      "fgHex": "#3a3a3a",
      "bgHex": "#050505",
      "ratio": 1.79,
      "tag": "fail"
    },
    {
      "mode": "mono-dark",
      "fg": "cursor",
      "bg": "bg",
      "fgHex": "#ffffff",
      "bgHex": "#0d0d0d",
      "ratio": 19.44,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "cursor",
      "bg": "bg-subtle",
      "fgHex": "#ffffff",
      "bgHex": "#161616",
      "ratio": 18.1,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "cursor",
      "bg": "surface",
      "fgHex": "#ffffff",
      "bgHex": "#1f1f1f",
      "ratio": 16.48,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "cursor",
      "bg": "surface-raised",
      "fgHex": "#ffffff",
      "bgHex": "#282828",
      "ratio": 14.74,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "cursor",
      "bg": "scrim",
      "fgHex": "#ffffff",
      "bgHex": "#050505",
      "ratio": 20.38,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-err",
      "bg": "bg",
      "fgHex": "#f0f0f0",
      "bgHex": "#0d0d0d",
      "ratio": 17.05,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-err",
      "bg": "bg-subtle",
      "fgHex": "#f0f0f0",
      "bgHex": "#161616",
      "ratio": 15.88,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-err",
      "bg": "surface",
      "fgHex": "#f0f0f0",
      "bgHex": "#1f1f1f",
      "ratio": 14.46,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-err",
      "bg": "surface-raised",
      "fgHex": "#f0f0f0",
      "bgHex": "#282828",
      "ratio": 12.94,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-err",
      "bg": "scrim",
      "fgHex": "#f0f0f0",
      "bgHex": "#050505",
      "ratio": 17.88,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-warn",
      "bg": "bg",
      "fgHex": "#b8b8b8",
      "bgHex": "#0d0d0d",
      "ratio": 9.8,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-warn",
      "bg": "bg-subtle",
      "fgHex": "#b8b8b8",
      "bgHex": "#161616",
      "ratio": 9.12,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-warn",
      "bg": "surface",
      "fgHex": "#b8b8b8",
      "bgHex": "#1f1f1f",
      "ratio": 8.31,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-warn",
      "bg": "surface-raised",
      "fgHex": "#b8b8b8",
      "bgHex": "#282828",
      "ratio": 7.43,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-warn",
      "bg": "scrim",
      "fgHex": "#b8b8b8",
      "bgHex": "#050505",
      "ratio": 10.27,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-ok",
      "bg": "bg",
      "fgHex": "#909090",
      "bgHex": "#0d0d0d",
      "ratio": 6.09,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-ok",
      "bg": "bg-subtle",
      "fgHex": "#909090",
      "bgHex": "#161616",
      "ratio": 5.67,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-ok",
      "bg": "surface",
      "fgHex": "#909090",
      "bgHex": "#1f1f1f",
      "ratio": 5.16,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-ok",
      "bg": "surface-raised",
      "fgHex": "#909090",
      "bgHex": "#282828",
      "ratio": 4.62,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-ok",
      "bg": "scrim",
      "fgHex": "#909090",
      "bgHex": "#050505",
      "ratio": 6.38,
      "tag": "AA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-info",
      "bg": "bg",
      "fgHex": "#d0d0d0",
      "bgHex": "#0d0d0d",
      "ratio": 12.6,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-info",
      "bg": "bg-subtle",
      "fgHex": "#d0d0d0",
      "bgHex": "#161616",
      "ratio": 11.73,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-info",
      "bg": "surface",
      "fgHex": "#d0d0d0",
      "bgHex": "#1f1f1f",
      "ratio": 10.69,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-info",
      "bg": "surface-raised",
      "fgHex": "#d0d0d0",
      "bgHex": "#282828",
      "ratio": 9.56,
      "tag": "AAA"
    },
    {
      "mode": "mono-dark",
      "fg": "status-info",
      "bg": "scrim",
      "fgHex": "#d0d0d0",
      "bgHex": "#050505",
      "ratio": 13.21,
      "tag": "AAA"
    }
  ],
  "swatchContrast": {
    "light": {
      "text-heading": {
        "ratio": 17.3,
        "tag": "AAA"
      },
      "text": {
        "ratio": 14.22,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 6.5,
        "tag": "AA"
      },
      "text-faint": {
        "ratio": 3.18,
        "tag": "AA Large"
      },
      "accent": {
        "ratio": 8.35,
        "tag": "AAA"
      },
      "accent-hover": {
        "ratio": 6.28,
        "tag": "AA"
      },
      "brand": {
        "ratio": 5.16,
        "tag": "AA"
      },
      "accent-subtle": {
        "ratio": 1.21,
        "tag": "fail"
      },
      "selection-bg": {
        "ratio": 1.22,
        "tag": "fail"
      },
      "cursor": {
        "ratio": 8.35,
        "tag": "AAA"
      },
      "status-err": {
        "ratio": 7.53,
        "tag": "AAA"
      },
      "status-warn": {
        "ratio": 6.58,
        "tag": "AA"
      },
      "status-ok": {
        "ratio": 6.62,
        "tag": "AA"
      },
      "status-info": {
        "ratio": 6.64,
        "tag": "AA"
      }
    },
    "dark": {
      "text-heading": {
        "ratio": 17.41,
        "tag": "AAA"
      },
      "text": {
        "ratio": 13.68,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 7.29,
        "tag": "AAA"
      },
      "text-faint": {
        "ratio": 3.58,
        "tag": "AA Large"
      },
      "accent": {
        "ratio": 8.64,
        "tag": "AAA"
      },
      "accent-hover": {
        "ratio": 10.77,
        "tag": "AAA"
      },
      "brand": {
        "ratio": 7.67,
        "tag": "AAA"
      },
      "accent-subtle": {
        "ratio": 1.2,
        "tag": "fail"
      },
      "selection-bg": {
        "ratio": 1.46,
        "tag": "fail"
      },
      "cursor": {
        "ratio": 8.64,
        "tag": "AAA"
      },
      "status-err": {
        "ratio": 6.25,
        "tag": "AA"
      },
      "status-warn": {
        "ratio": 9.58,
        "tag": "AAA"
      },
      "status-ok": {
        "ratio": 8.48,
        "tag": "AAA"
      },
      "status-info": {
        "ratio": 8.44,
        "tag": "AAA"
      }
    },
    "mono-light": {
      "text-heading": {
        "ratio": 15.82,
        "tag": "AAA"
      },
      "text": {
        "ratio": 12.87,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 6.67,
        "tag": "AA"
      },
      "text-faint": {
        "ratio": 3.74,
        "tag": "AA Large"
      },
      "accent": {
        "ratio": 19.09,
        "tag": "AAA"
      },
      "accent-hover": {
        "ratio": 11.49,
        "tag": "AAA"
      },
      "brand": {
        "ratio": 10.34,
        "tag": "AAA"
      },
      "accent-subtle": {
        "ratio": 1.25,
        "tag": "fail"
      },
      "selection-bg": {
        "ratio": 1.52,
        "tag": "fail"
      },
      "cursor": {
        "ratio": 19.09,
        "tag": "AAA"
      },
      "status-err": {
        "ratio": 14.99,
        "tag": "AAA"
      },
      "status-warn": {
        "ratio": 8.72,
        "tag": "AAA"
      },
      "status-ok": {
        "ratio": 6.67,
        "tag": "AA"
      },
      "status-info": {
        "ratio": 11.49,
        "tag": "AAA"
      }
    },
    "mono-dark": {
      "text-heading": {
        "ratio": 17.36,
        "tag": "AAA"
      },
      "text": {
        "ratio": 13.9,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 6.91,
        "tag": "AA"
      },
      "text-faint": {
        "ratio": 3.59,
        "tag": "AA Large"
      },
      "accent": {
        "ratio": 19.44,
        "tag": "AAA"
      },
      "accent-hover": {
        "ratio": 14.17,
        "tag": "AAA"
      },
      "brand": {
        "ratio": 15.86,
        "tag": "AAA"
      },
      "accent-subtle": {
        "ratio": 1.25,
        "tag": "fail"
      },
      "selection-bg": {
        "ratio": 1.71,
        "tag": "fail"
      },
      "cursor": {
        "ratio": 19.44,
        "tag": "AAA"
      },
      "status-err": {
        "ratio": 17.05,
        "tag": "AAA"
      },
      "status-warn": {
        "ratio": 9.8,
        "tag": "AAA"
      },
      "status-ok": {
        "ratio": 6.09,
        "tag": "AA"
      },
      "status-info": {
        "ratio": 12.6,
        "tag": "AAA"
      }
    }
  }
};

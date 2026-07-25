// tokens-data.js — GENERATED from tokens.json. Do not edit by hand.
// Used by index.html to render dynamic color swatches and token tables.
// Includes derived data: contrastPairs (every fg×bg×mode), swatchContrast
// (one ratio per fg role per mode against bg).
export const tokens = {
  "meta": {
    "name": "Jylhis Design System",
    "version": "0.5.0"
  },
  "groups": {
    "grounds": {
      "label": "Grounds",
      "blurb": "the survey sheet itself — page backgrounds and card surfaces, four tonal steps",
      "members": [
        "bg",
        "bg-subtle",
        "surface",
        "surface-raised"
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
      "ansi": "unspecified-bg",
      "notes": "Sheet / Field ground; cool near-white / near-black, never pure. On 16-color TTY, inherit terminal's own bg"
    },
    "bg-subtle": {
      "light": "#eef2f6",
      "dark": "#14171e",
      "x256": {
        "light": "color-253",
        "dark": "color-235"
      },
      "notes": "code fills, zebra, inactive modeline; x256 indices restore the elevation step the cool near-grounds otherwise collapse into bg on a 256-color TTY"
    },
    "surface": {
      "light": "#e6ecf1",
      "dark": "#1b1f28",
      "x256": {
        "light": "color-251",
        "dark": "color-237"
      },
      "notes": "card / panel fill (active modeline bg); x256 pinned distinct from bg — see bg-subtle"
    },
    "surface-raised": {
      "light": "#fcfdff",
      "dark": "#232833",
      "x256": {
        "dark": "color-239"
      },
      "notes": "plates, modals, dropdowns — above the sheet; x256 dark bumped to stay the most-elevated grayscale step. light quantizes to near-white already"
    },
    "text": {
      "light": "#23262e",
      "dark": "#d6dae2",
      "ansi": "unspecified-fg",
      "notes": "body (AAA); on 16-color TTY, inherit terminal's own fg"
    },
    "text-muted": {
      "light": "#565a63",
      "dark": "#9aa0ab",
      "notes": "meta / captions / help (AA)"
    },
    "text-heading": {
      "light": "#12141a",
      "dark": "#f2f4f8",
      "notes": "titles (AAA)"
    },
    "text-faint": {
      "light": "#878c95",
      "dark": "#656b76",
      "notes": "graticule labels, disabled meta, decoration only (lint keeps faint off body/meta text)"
    },
    "accent": {
      "light": "#8a4d00",
      "dark": "#e0a33a",
      "ansi": "bright-yellow",
      "notes": "bronze interactive accent, used as link text (AA on every surface / AAA on dark bg); ANSI slot 11 is always the bronze accent"
    },
    "accent-hover": {
      "light": "#a75f0a",
      "dark": "#f0b95c",
      "notes": ":hover / :active only"
    },
    "brand": {
      "light": "#b5450e",
      "dark": "#ef8a4a",
      "notes": "benchmark vermilion — the maker's mark and datum triangle (large marks); distinct from status red"
    },
    "contour": {
      "light": "#2f4fb0",
      "dark": "#6f9be0",
      "notes": "structural Modus-blue linework — contour rings, dividers, diagram strokes; structure only, never interaction"
    },
    "border": {
      "light": "#cfd6de",
      "dark": "#2b303b",
      "notes": "default 1px survey hairline"
    },
    "border-strong": {
      "light": "#aab4c0",
      "dark": "#3a4150",
      "notes": "table heads, field hover"
    },
    "decorator": {
      "light": "#7f8fb5",
      "dark": "#39415a",
      "notes": "graticule / dashed rules (contour-faint)"
    },
    "accent-subtle": {
      "light": "#e9e3dd",
      "dark": "#262119",
      "notes": "opaque approximation of accent @ ~12% on bg"
    },
    "selection-bg": {
      "light": "#ece0cf",
      "dark": "#3a2f1c",
      "notes": "text selection highlight (bronze-tinted)"
    },
    "cursor": {
      "light": "#8a4d00",
      "dark": "#e0a33a",
      "notes": "input cursor (matches accent)"
    },
    "scrim": {
      "light": "#14171e",
      "dark": "#05060a",
      "notes": "modal/overlay scrim ink; emitted as translucent rgba --color-scrim in CSS (light 0.4, dark 0.55)"
    }
  },
  "syntax": {
    "syn-keyword": {
      "light": "#5317ac",
      "dark": "#b6a0ff",
      "modus": "magenta-cooler — purple keyword"
    },
    "syn-string": {
      "light": "#2544bb",
      "dark": "#79a8ff",
      "modus": "blue-warmer — string"
    },
    "syn-number": {
      "light": "#0031a9",
      "dark": "#79bbff",
      "modus": "blue — number"
    },
    "syn-function": {
      "light": "#721045",
      "dark": "#feacd0",
      "modus": "magenta — function name"
    },
    "syn-builtin": {
      "light": "#8f0075",
      "dark": "#f78fe7",
      "modus": "magenta-warmer — builtin"
    },
    "syn-type": {
      "light": "#005a5f",
      "dark": "#6ae4b9",
      "modus": "cyan-cooler — type"
    },
    "syn-variable": {
      "light": "#0044aa",
      "dark": "#00d3d0",
      "modus": "blue/cyan — variable"
    },
    "syn-comment": {
      "light": "#595959",
      "dark": "#9a9a9a",
      "modus": "fg-dim — comment (italic); AA on every surface"
    },
    "syn-docstring": {
      "light": "#2a5a3a",
      "dark": "#88ca9f",
      "modus": "green-faint — docstring"
    }
  },
  "status": {
    "status-err": {
      "light": "#a60000",
      "dark": "#f0685f",
      "ansi": "red",
      "modus": "red"
    },
    "status-warn": {
      "light": "#8a5000",
      "dark": "#d9b34a",
      "ansi": "yellow",
      "modus": "yellow (orange-leaning; avoids blue-vs-yellow tritanopia trap)"
    },
    "status-ok": {
      "light": "#006800",
      "dark": "#6bbf6b",
      "ansi": "green",
      "modus": "green"
    },
    "status-info": {
      "light": "#005e8b",
      "dark": "#5fb8cf",
      "ansi": "blue",
      "modus": "cyan-blue (teal-leaning for tritanopia)"
    }
  },
  "ansi": [
    {
      "name": "black",
      "light": "#23262e",
      "dark": "#0d0f14",
      "role": "text/bg inversion"
    },
    {
      "name": "red",
      "light": "#a60000",
      "dark": "#f0685f",
      "role": "Modus red — errors"
    },
    {
      "name": "green",
      "light": "#006800",
      "dark": "#6bbf6b",
      "role": "Modus green — ok"
    },
    {
      "name": "yellow",
      "light": "#8a5000",
      "dark": "#d9b34a",
      "role": "Modus yellow — warnings"
    },
    {
      "name": "blue",
      "light": "#0031a9",
      "dark": "#79a8ff",
      "role": "Modus blue — info"
    },
    {
      "name": "magenta",
      "light": "#721045",
      "dark": "#feacd0",
      "role": "Modus magenta"
    },
    {
      "name": "cyan",
      "light": "#005a5f",
      "dark": "#6ae4b9",
      "role": "Modus cyan-cooler"
    },
    {
      "name": "white",
      "light": "#565a63",
      "dark": "#c9dedf",
      "role": "ANSI 7 — text-muted on Sheet, body-dim on Field"
    },
    {
      "name": "bright-black",
      "light": "#878c95",
      "dark": "#656b76",
      "role": "faint"
    },
    {
      "name": "bright-red",
      "light": "#b60000",
      "dark": "#ff7f7f",
      "role": "red-warmer"
    },
    {
      "name": "bright-green",
      "light": "#315b00",
      "dark": "#70b900",
      "role": "green-warmer"
    },
    {
      "name": "bright-yellow",
      "light": "#8a4d00",
      "dark": "#e0a33a",
      "role": "bronze accent (intentional override — ANSI 11)"
    },
    {
      "name": "bright-blue",
      "light": "#3548cf",
      "dark": "#79a8ff",
      "role": "Modus blue-warmer / contour"
    },
    {
      "name": "bright-magenta",
      "light": "#531ab6",
      "dark": "#b6a0ff",
      "role": "Modus magenta-cooler"
    },
    {
      "name": "bright-cyan",
      "light": "#005e8b",
      "dark": "#00d3d0",
      "role": "Modus cyan"
    },
    {
      "name": "bright-white",
      "light": "#23262e",
      "dark": "#f2f4f8",
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
      0.85,
      0.8,
      0.75,
      0.72
    ]
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
    "sm": "640px",
    "md": "860px",
    "notes": "CSS media queries cannot read custom properties; hand-authored @media rules repeat these values literally and carry a `/* breakpoints.<name> */` comment."
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
      "rowPadY": "12px",
      "hitTargetMin": "44px",
      "gapInline": "12px",
      "gapBlock": "24px"
    },
    "compact": {
      "lineHeight": 1.5,
      "rowPadY": "6px",
      "hitTargetMin": "36px",
      "gapInline": "8px",
      "gapBlock": "16px"
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
    "spring": {
      "duration": "480ms",
      "css": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "hypr": "0.2,0.8,0.2,1",
      "notes": "the long 'survey renders in' ease — expo-out, no overshoot (the system bans bounce); drives contour-draw / line-extend / count-up. Key kept as `spring` until generate.mjs is updated in Phase 2."
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
      "min": 4.5,
      "label": "AA bronze accent (Sheet)"
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
      "min": 7,
      "label": "AAA syn-string (Sheet)"
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
      "fg": "accent",
      "bg": "bg",
      "fgHex": "#8a4d00",
      "bgHex": "#f6f8fb",
      "ratio": 6.28,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "bg-subtle",
      "fgHex": "#8a4d00",
      "bgHex": "#eef2f6",
      "ratio": 5.94,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "surface",
      "fgHex": "#8a4d00",
      "bgHex": "#e6ecf1",
      "ratio": 5.61,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "surface-raised",
      "fgHex": "#8a4d00",
      "bgHex": "#fcfdff",
      "ratio": 6.57,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "bg",
      "fgHex": "#a75f0a",
      "bgHex": "#f6f8fb",
      "ratio": 4.61,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "bg-subtle",
      "fgHex": "#a75f0a",
      "bgHex": "#eef2f6",
      "ratio": 4.36,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "surface",
      "fgHex": "#a75f0a",
      "bgHex": "#e6ecf1",
      "ratio": 4.12,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "surface-raised",
      "fgHex": "#a75f0a",
      "bgHex": "#fcfdff",
      "ratio": 4.82,
      "tag": "AA"
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
      "fg": "accent-subtle",
      "bg": "bg",
      "fgHex": "#e9e3dd",
      "bgHex": "#f6f8fb",
      "ratio": 1.2,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "bg-subtle",
      "fgHex": "#e9e3dd",
      "bgHex": "#eef2f6",
      "ratio": 1.13,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "surface",
      "fgHex": "#e9e3dd",
      "bgHex": "#e6ecf1",
      "ratio": 1.07,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "surface-raised",
      "fgHex": "#e9e3dd",
      "bgHex": "#fcfdff",
      "ratio": 1.25,
      "tag": "fail"
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
      "fg": "cursor",
      "bg": "bg",
      "fgHex": "#8a4d00",
      "bgHex": "#f6f8fb",
      "ratio": 6.28,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "bg-subtle",
      "fgHex": "#8a4d00",
      "bgHex": "#eef2f6",
      "ratio": 5.94,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "surface",
      "fgHex": "#8a4d00",
      "bgHex": "#e6ecf1",
      "ratio": 5.61,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "surface-raised",
      "fgHex": "#8a4d00",
      "bgHex": "#fcfdff",
      "ratio": 6.57,
      "tag": "AA"
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
      "fg": "status-warn",
      "bg": "bg",
      "fgHex": "#8a5000",
      "bgHex": "#f6f8fb",
      "ratio": 6.11,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "bg-subtle",
      "fgHex": "#8a5000",
      "bgHex": "#eef2f6",
      "ratio": 5.78,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "surface",
      "fgHex": "#8a5000",
      "bgHex": "#e6ecf1",
      "ratio": 5.46,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "surface-raised",
      "fgHex": "#8a5000",
      "bgHex": "#fcfdff",
      "ratio": 6.39,
      "tag": "AA"
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
        "ratio": 6.28,
        "tag": "AA"
      },
      "accent-hover": {
        "ratio": 4.61,
        "tag": "AA"
      },
      "brand": {
        "ratio": 5.16,
        "tag": "AA"
      },
      "accent-subtle": {
        "ratio": 1.2,
        "tag": "fail"
      },
      "selection-bg": {
        "ratio": 1.22,
        "tag": "fail"
      },
      "cursor": {
        "ratio": 6.28,
        "tag": "AA"
      },
      "status-err": {
        "ratio": 7.53,
        "tag": "AAA"
      },
      "status-warn": {
        "ratio": 6.11,
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
    }
  }
};

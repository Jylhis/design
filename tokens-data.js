// tokens-data.js — GENERATED from tokens.core.json + themes/*.json. Do not edit by hand.
// Top level mirrors the default theme (survey) for compatibility; every theme lives under `themes`.
// Includes derived data: contrastPairs (measured fg×bg×mode) and swatchContrast (role vs bg).
export const tokens = {
  "palette": {
    "bg": {
      "light": "#f6f8fb",
      "dark": "#0d0f14",
      "ansi": "unspecified-bg",
      "notes": "cool near-white / near-black, never pure; 16-color TTY inherits terminal bg"
    },
    "bg-subtle": {
      "light": "#eef2f6",
      "dark": "#14171e",
      "x256": {
        "light": "color-253",
        "dark": "color-235"
      },
      "notes": "code fills, zebra, inactive modeline"
    },
    "surface": {
      "light": "#e6ecf1",
      "dark": "#1b1f28",
      "x256": {
        "light": "color-251",
        "dark": "color-237"
      },
      "notes": "card / panel fill"
    },
    "surface-raised": {
      "light": "#fcfdff",
      "dark": "#232833",
      "x256": {
        "dark": "color-239"
      },
      "notes": "plates, modals, dropdowns"
    },
    "text": {
      "light": "#23262e",
      "dark": "#d6dae2",
      "ansi": "unspecified-fg",
      "notes": "body (AAA)"
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
      "notes": "decoration only"
    },
    "accent": {
      "light": "#6f3e00",
      "dark": "#e0a33a",
      "ansi": "bright-yellow",
      "notes": "bronze interactive accent (AAA); ANSI 11 is always the accent"
    },
    "accent-hover": {
      "light": "#8a4d00",
      "dark": "#f0b95c",
      "notes": ":hover / :active only"
    },
    "brand": {
      "light": "#b5450e",
      "dark": "#ef8a4a",
      "notes": "benchmark vermilion — maker's mark and datum triangle; distinct from status red"
    },
    "contour": {
      "light": "#2f4fb0",
      "dark": "#6f9be0",
      "notes": "structural Modus-blue linework; never interaction"
    },
    "border": {
      "light": "#cfd6de",
      "dark": "#2b303b",
      "notes": "default 1px hairline"
    },
    "border-strong": {
      "light": "#aab4c0",
      "dark": "#3a4150",
      "notes": "table heads, field hover"
    },
    "decorator": {
      "light": "#7f8fb5",
      "dark": "#39415a",
      "notes": "graticule / dashed rules"
    },
    "accent-subtle": {
      "light": "#e6e2dd",
      "dark": "#262119",
      "notes": "opaque approximation of accent @ ~12% on bg; CSS emits rgba"
    },
    "selection-bg": {
      "light": "#ece0cf",
      "dark": "#3a2f1c",
      "notes": "text selection (bronze-tinted)"
    },
    "cursor": {
      "light": "#6f3e00",
      "dark": "#e0a33a",
      "notes": "input cursor (matches accent)"
    },
    "scrim": {
      "light": "#14171e",
      "dark": "#05060a",
      "notes": "overlay scrim ink; CSS emits rgba (light 0.4, dark 0.55)"
    }
  },
  "syntax": {
    "syn-keyword": {
      "light": "#531ab6",
      "dark": "#b6a0ff",
      "modus": "magenta-cooler"
    },
    "syn-string": {
      "light": "#3548cf",
      "dark": "#79a8ff",
      "modus": "blue-warmer (AA floor 6.63:1 on the cool Sheet ground)"
    },
    "syn-number": {
      "light": "#0000b0",
      "dark": "#00bcff",
      "modus": "blue-cooler (constant slot)"
    },
    "syn-function": {
      "light": "#721045",
      "dark": "#feacd0",
      "modus": "magenta"
    },
    "syn-builtin": {
      "light": "#8f0075",
      "dark": "#f78fe7",
      "modus": "magenta-warmer"
    },
    "syn-type": {
      "light": "#005f5f",
      "dark": "#6ae4b9",
      "modus": "cyan-cooler"
    },
    "syn-variable": {
      "light": "#005e8b",
      "dark": "#00d3d0",
      "modus": "cyan"
    },
    "syn-comment": {
      "light": "#595959",
      "dark": "#989898",
      "style": "italic",
      "modus": "fg-dim"
    },
    "syn-docstring": {
      "light": "#2a5045",
      "dark": "#9ac8e0",
      "modus": "green-faint (Operandi) / cyan-faint (Vivendi)"
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
      "light": "#884900",
      "dark": "#d9b34a",
      "ansi": "yellow",
      "modus": "yellow-warmer"
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
      "modus": "cyan-blue"
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
      "role": "errors"
    },
    {
      "name": "green",
      "light": "#006800",
      "dark": "#6bbf6b",
      "role": "ok"
    },
    {
      "name": "yellow",
      "light": "#884900",
      "dark": "#d9b34a",
      "role": "warnings"
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
      "role": "ANSI 7"
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
      "light": "#316500",
      "dark": "#70b900",
      "role": "green-warmer"
    },
    {
      "name": "bright-yellow",
      "light": "#6f3e00",
      "dark": "#e0a33a",
      "role": "accent (intentional override — ANSI 11)"
    },
    {
      "name": "bright-blue",
      "light": "#3548cf",
      "dark": "#79a8ff",
      "role": "blue-warmer / contour"
    },
    {
      "name": "bright-magenta",
      "light": "#531ab6",
      "dark": "#b6a0ff",
      "role": "magenta-cooler"
    },
    {
      "name": "bright-cyan",
      "light": "#005e8b",
      "dark": "#00d3d0",
      "role": "cyan"
    },
    {
      "name": "bright-white",
      "light": "#23262e",
      "dark": "#f2f4f8",
      "role": "ANSI 15"
    }
  ],
  "pairs": {
    "accent": {
      "fg": "bg",
      "min": 4.5,
      "label": "label on the accent fill — primary button"
    },
    "accent-hover": {
      "fg": "bg",
      "min": 4.5,
      "label": "label on the accent :hover/:active fill"
    },
    "brand": {
      "fg": "bg",
      "min": 4.5,
      "label": "label on a solid maker's-mark fill"
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
      "label": "body on a raised plate / modal"
    },
    "selection-bg": {
      "fg": "text",
      "min": 7,
      "label": "selected text on the selection highlight"
    }
  },
  "swatchContrast": {
    "light": {
      "text": {
        "ratio": 14.22,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 6.5,
        "tag": "AA"
      },
      "text-heading": {
        "ratio": 17.3,
        "tag": "AAA"
      },
      "text-faint": {
        "ratio": 3.18,
        "tag": "fail"
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
      "contour": {
        "ratio": 6.89,
        "tag": "AA"
      },
      "syn-keyword": {
        "ratio": 9.01,
        "tag": "AAA"
      },
      "syn-string": {
        "ratio": 6.63,
        "tag": "AA"
      },
      "syn-number": {
        "ratio": 12.13,
        "tag": "AAA"
      },
      "syn-function": {
        "ratio": 10.52,
        "tag": "AAA"
      },
      "syn-builtin": {
        "ratio": 8.14,
        "tag": "AAA"
      },
      "syn-type": {
        "ratio": 7.04,
        "tag": "AAA"
      },
      "syn-variable": {
        "ratio": 6.64,
        "tag": "AA"
      },
      "syn-comment": {
        "ratio": 6.58,
        "tag": "AA"
      },
      "syn-docstring": {
        "ratio": 8.46,
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
      "text": {
        "ratio": 13.68,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 7.29,
        "tag": "AAA"
      },
      "text-heading": {
        "ratio": 17.41,
        "tag": "AAA"
      },
      "text-faint": {
        "ratio": 3.58,
        "tag": "fail"
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
      "contour": {
        "ratio": 6.79,
        "tag": "AA"
      },
      "syn-keyword": {
        "ratio": 8.64,
        "tag": "AAA"
      },
      "syn-string": {
        "ratio": 8.09,
        "tag": "AAA"
      },
      "syn-number": {
        "ratio": 8.8,
        "tag": "AAA"
      },
      "syn-function": {
        "ratio": 10.98,
        "tag": "AAA"
      },
      "syn-builtin": {
        "ratio": 9.16,
        "tag": "AAA"
      },
      "syn-type": {
        "ratio": 12.24,
        "tag": "AAA"
      },
      "syn-variable": {
        "ratio": 10.25,
        "tag": "AAA"
      },
      "syn-comment": {
        "ratio": 6.64,
        "tag": "AA"
      },
      "syn-docstring": {
        "ratio": 10.69,
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
  },
  "contrastPairs": [
    {
      "fg": "text",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "measured": 14.22
    },
    {
      "fg": "text",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "measured": 13.68
    },
    {
      "fg": "text-heading",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "measured": 17.3
    },
    {
      "fg": "text-heading",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "measured": 17.41
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 6.5
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "measured": 7.29
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "measured": 8.35
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "measured": 8.64
    },
    {
      "fg": "contour",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 6.89
    },
    {
      "fg": "contour",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "measured": 6.79
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "measured": 9.01
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "measured": 8.64
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 6.63
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "measured": 8.09
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "measured": 10.52
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "measured": 10.98
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "measured": 7.04
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "measured": 12.24
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 12.13
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "measured": 8.8
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 8.14
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "measured": 9.16
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 6.64
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "measured": 10.25
    },
    {
      "fg": "syn-comment",
      "bg": "surface",
      "mode": "light",
      "min": 4.5,
      "measured": 5.88
    },
    {
      "fg": "syn-comment",
      "bg": "surface-raised",
      "mode": "dark",
      "min": 4.5,
      "measured": 5.12
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 8.46
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "measured": 10.69
    },
    {
      "fg": "status-err",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 7.53
    },
    {
      "fg": "status-warn",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 6.58
    },
    {
      "fg": "status-ok",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 6.62
    },
    {
      "fg": "status-info",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "measured": 6.64
    }
  ],
  "meta": {
    "name": "Jylhis Design System",
    "version": "2.0.0",
    "description": "Theme-independent core framework: structure, type, spacing, motion, density. Color identity lives in themes/<slug>.json; every theme ships a light and a dark mode.",
    "defaultTheme": "survey",
    "selector": {
      "theme": "data-theme=\"<slug>\" on <html> (omit for the default theme)",
      "mode": "data-mode=\"light|dark\" on <html> (omit for light)"
    },
    "themes": {
      "survey": {
        "label": "Survey",
        "file": "themes/survey.json"
      },
      "mono": {
        "label": "Monochrome",
        "file": "themes/mono.json"
      }
    },
    "theme": "survey",
    "themeMeta": {
      "name": "Survey",
      "slug": "survey",
      "blurb": "cool sheet grounds, bronze accent, vermilion maker's mark, contour-blue linework — the printed survey and the night field-book",
      "modes": {
        "light": "Sheet — the printed survey",
        "dark": "Field — the night field-book"
      }
    }
  },
  "groups": {
    "grounds": {
      "label": "Grounds",
      "blurb": "page backgrounds and card surfaces, four tonal steps",
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
    "accent": {
      "label": "Accent",
      "blurb": "the single interactive accent plus the maker's mark and its tints — links, focus rings, the datum mark",
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
      "blurb": "linework — hairline borders, graticule dashes, and the structural contour stroke",
      "members": [
        "border",
        "border-strong",
        "decorator",
        "contour"
      ]
    },
    "modus": {
      "label": "Modus",
      "blurb": "syntax role taxonomy — keyword, string, type, comment; a theme maps these to its own syntax voice, never repurposed for UI",
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
      "blurb": "status colors — error, warning, ok, info; always paired with a glyph + word (themes may not drop them to grayscale)",
      "members": [
        "status-err",
        "status-warn",
        "status-ok",
        "status-info"
      ]
    },
    "spectrum": {
      "label": "Spectrum",
      "blurb": "the 16-slot ANSI terminal palette; slot 11 is always the theme's interactive accent",
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
      "notes": "Every step is a rem multiple of the user agent's root font size — the system never sets `html { font-size }`. readableFloor is the smallest step for text a user must read; absoluteFloor is the hard floor for glanceable chrome. Enforced by scripts/validate-a11y-type.mjs; specified in docs/ACCESSIBILITY.md."
    },
    "notes": "Themes may override any typography entry via their own `typography` block; both current themes share the core stack."
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
    "notes": "em units, resolved against the browser's default font size (never a page `html { font-size }`). 40em/53.75em are 640px/860px at the 16px default. Hand-authored @media rules repeat these values literally with a `/* breakpoints.<name> */` comment."
  },
  "zIndex": {
    "base": 0,
    "sticky": 10,
    "scrim": 100,
    "modal": 110,
    "toast": 120,
    "skip": 130,
    "notes": "Semantic layering scale. `skip` sits above everything; scrim/modal/toast are reserved overlay slots."
  },
  "borderWidth": {
    "hairline": "1px",
    "focus": "2px",
    "marker": "3px",
    "notes": "hairline = default component border; focus mirrors focus.width (validated); marker = selected-item stripe per platforms/KEYBOARD.md."
  },
  "focus": {
    "width": "2px",
    "offset": "2px",
    "notes": "ring stroke + offset; colour is always `accent`. See platforms/KEYBOARD.md."
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
      "notes": "the long render-in ease — expo-out, no overshoot (the system bans bounce); drives contour-draw / line-extend / readout"
    }
  },
  "themes": {
    "survey": {
      "meta": {
        "name": "Survey",
        "slug": "survey",
        "blurb": "cool sheet grounds, bronze accent, vermilion maker's mark, contour-blue linework — the printed survey and the night field-book",
        "modes": {
          "light": "Sheet — the printed survey",
          "dark": "Field — the night field-book"
        }
      },
      "palette": {
        "bg": {
          "light": "#f6f8fb",
          "dark": "#0d0f14",
          "ansi": "unspecified-bg",
          "notes": "cool near-white / near-black, never pure; 16-color TTY inherits terminal bg"
        },
        "bg-subtle": {
          "light": "#eef2f6",
          "dark": "#14171e",
          "x256": {
            "light": "color-253",
            "dark": "color-235"
          },
          "notes": "code fills, zebra, inactive modeline"
        },
        "surface": {
          "light": "#e6ecf1",
          "dark": "#1b1f28",
          "x256": {
            "light": "color-251",
            "dark": "color-237"
          },
          "notes": "card / panel fill"
        },
        "surface-raised": {
          "light": "#fcfdff",
          "dark": "#232833",
          "x256": {
            "dark": "color-239"
          },
          "notes": "plates, modals, dropdowns"
        },
        "text": {
          "light": "#23262e",
          "dark": "#d6dae2",
          "ansi": "unspecified-fg",
          "notes": "body (AAA)"
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
          "notes": "decoration only"
        },
        "accent": {
          "light": "#6f3e00",
          "dark": "#e0a33a",
          "ansi": "bright-yellow",
          "notes": "bronze interactive accent (AAA); ANSI 11 is always the accent"
        },
        "accent-hover": {
          "light": "#8a4d00",
          "dark": "#f0b95c",
          "notes": ":hover / :active only"
        },
        "brand": {
          "light": "#b5450e",
          "dark": "#ef8a4a",
          "notes": "benchmark vermilion — maker's mark and datum triangle; distinct from status red"
        },
        "contour": {
          "light": "#2f4fb0",
          "dark": "#6f9be0",
          "notes": "structural Modus-blue linework; never interaction"
        },
        "border": {
          "light": "#cfd6de",
          "dark": "#2b303b",
          "notes": "default 1px hairline"
        },
        "border-strong": {
          "light": "#aab4c0",
          "dark": "#3a4150",
          "notes": "table heads, field hover"
        },
        "decorator": {
          "light": "#7f8fb5",
          "dark": "#39415a",
          "notes": "graticule / dashed rules"
        },
        "accent-subtle": {
          "light": "#e6e2dd",
          "dark": "#262119",
          "notes": "opaque approximation of accent @ ~12% on bg; CSS emits rgba"
        },
        "selection-bg": {
          "light": "#ece0cf",
          "dark": "#3a2f1c",
          "notes": "text selection (bronze-tinted)"
        },
        "cursor": {
          "light": "#6f3e00",
          "dark": "#e0a33a",
          "notes": "input cursor (matches accent)"
        },
        "scrim": {
          "light": "#14171e",
          "dark": "#05060a",
          "notes": "overlay scrim ink; CSS emits rgba (light 0.4, dark 0.55)"
        }
      },
      "syntax": {
        "syn-keyword": {
          "light": "#531ab6",
          "dark": "#b6a0ff",
          "modus": "magenta-cooler"
        },
        "syn-string": {
          "light": "#3548cf",
          "dark": "#79a8ff",
          "modus": "blue-warmer (AA floor 6.63:1 on the cool Sheet ground)"
        },
        "syn-number": {
          "light": "#0000b0",
          "dark": "#00bcff",
          "modus": "blue-cooler (constant slot)"
        },
        "syn-function": {
          "light": "#721045",
          "dark": "#feacd0",
          "modus": "magenta"
        },
        "syn-builtin": {
          "light": "#8f0075",
          "dark": "#f78fe7",
          "modus": "magenta-warmer"
        },
        "syn-type": {
          "light": "#005f5f",
          "dark": "#6ae4b9",
          "modus": "cyan-cooler"
        },
        "syn-variable": {
          "light": "#005e8b",
          "dark": "#00d3d0",
          "modus": "cyan"
        },
        "syn-comment": {
          "light": "#595959",
          "dark": "#989898",
          "style": "italic",
          "modus": "fg-dim"
        },
        "syn-docstring": {
          "light": "#2a5045",
          "dark": "#9ac8e0",
          "modus": "green-faint (Operandi) / cyan-faint (Vivendi)"
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
          "light": "#884900",
          "dark": "#d9b34a",
          "ansi": "yellow",
          "modus": "yellow-warmer"
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
          "modus": "cyan-blue"
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
          "role": "errors"
        },
        {
          "name": "green",
          "light": "#006800",
          "dark": "#6bbf6b",
          "role": "ok"
        },
        {
          "name": "yellow",
          "light": "#884900",
          "dark": "#d9b34a",
          "role": "warnings"
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
          "role": "ANSI 7"
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
          "light": "#316500",
          "dark": "#70b900",
          "role": "green-warmer"
        },
        {
          "name": "bright-yellow",
          "light": "#6f3e00",
          "dark": "#e0a33a",
          "role": "accent (intentional override — ANSI 11)"
        },
        {
          "name": "bright-blue",
          "light": "#3548cf",
          "dark": "#79a8ff",
          "role": "blue-warmer / contour"
        },
        {
          "name": "bright-magenta",
          "light": "#531ab6",
          "dark": "#b6a0ff",
          "role": "magenta-cooler"
        },
        {
          "name": "bright-cyan",
          "light": "#005e8b",
          "dark": "#00d3d0",
          "role": "cyan"
        },
        {
          "name": "bright-white",
          "light": "#23262e",
          "dark": "#f2f4f8",
          "role": "ANSI 15"
        }
      ],
      "pairs": {
        "accent": {
          "fg": "bg",
          "min": 4.5,
          "label": "label on the accent fill — primary button"
        },
        "accent-hover": {
          "fg": "bg",
          "min": 4.5,
          "label": "label on the accent :hover/:active fill"
        },
        "brand": {
          "fg": "bg",
          "min": 4.5,
          "label": "label on a solid maker's-mark fill"
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
          "label": "body on a raised plate / modal"
        },
        "selection-bg": {
          "fg": "text",
          "min": 7,
          "label": "selected text on the selection highlight"
        }
      },
      "swatchContrast": {
        "light": {
          "text": {
            "ratio": 14.22,
            "tag": "AAA"
          },
          "text-muted": {
            "ratio": 6.5,
            "tag": "AA"
          },
          "text-heading": {
            "ratio": 17.3,
            "tag": "AAA"
          },
          "text-faint": {
            "ratio": 3.18,
            "tag": "fail"
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
          "contour": {
            "ratio": 6.89,
            "tag": "AA"
          },
          "syn-keyword": {
            "ratio": 9.01,
            "tag": "AAA"
          },
          "syn-string": {
            "ratio": 6.63,
            "tag": "AA"
          },
          "syn-number": {
            "ratio": 12.13,
            "tag": "AAA"
          },
          "syn-function": {
            "ratio": 10.52,
            "tag": "AAA"
          },
          "syn-builtin": {
            "ratio": 8.14,
            "tag": "AAA"
          },
          "syn-type": {
            "ratio": 7.04,
            "tag": "AAA"
          },
          "syn-variable": {
            "ratio": 6.64,
            "tag": "AA"
          },
          "syn-comment": {
            "ratio": 6.58,
            "tag": "AA"
          },
          "syn-docstring": {
            "ratio": 8.46,
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
          "text": {
            "ratio": 13.68,
            "tag": "AAA"
          },
          "text-muted": {
            "ratio": 7.29,
            "tag": "AAA"
          },
          "text-heading": {
            "ratio": 17.41,
            "tag": "AAA"
          },
          "text-faint": {
            "ratio": 3.58,
            "tag": "fail"
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
          "contour": {
            "ratio": 6.79,
            "tag": "AA"
          },
          "syn-keyword": {
            "ratio": 8.64,
            "tag": "AAA"
          },
          "syn-string": {
            "ratio": 8.09,
            "tag": "AAA"
          },
          "syn-number": {
            "ratio": 8.8,
            "tag": "AAA"
          },
          "syn-function": {
            "ratio": 10.98,
            "tag": "AAA"
          },
          "syn-builtin": {
            "ratio": 9.16,
            "tag": "AAA"
          },
          "syn-type": {
            "ratio": 12.24,
            "tag": "AAA"
          },
          "syn-variable": {
            "ratio": 10.25,
            "tag": "AAA"
          },
          "syn-comment": {
            "ratio": 6.64,
            "tag": "AA"
          },
          "syn-docstring": {
            "ratio": 10.69,
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
      },
      "contrastPairs": [
        {
          "fg": "text",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 14.22
        },
        {
          "fg": "text",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 13.68
        },
        {
          "fg": "text-heading",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 17.3
        },
        {
          "fg": "text-heading",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 17.41
        },
        {
          "fg": "text-muted",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.5
        },
        {
          "fg": "text-muted",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 7.29
        },
        {
          "fg": "accent",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 8.35
        },
        {
          "fg": "accent",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 8.64
        },
        {
          "fg": "contour",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.89
        },
        {
          "fg": "contour",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 6.79
        },
        {
          "fg": "syn-keyword",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 9.01
        },
        {
          "fg": "syn-keyword",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 8.64
        },
        {
          "fg": "syn-string",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.63
        },
        {
          "fg": "syn-string",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 8.09
        },
        {
          "fg": "syn-function",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 10.52
        },
        {
          "fg": "syn-function",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 10.98
        },
        {
          "fg": "syn-type",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 7.04
        },
        {
          "fg": "syn-type",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 12.24
        },
        {
          "fg": "syn-number",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 12.13
        },
        {
          "fg": "syn-number",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 8.8
        },
        {
          "fg": "syn-builtin",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 8.14
        },
        {
          "fg": "syn-builtin",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 9.16
        },
        {
          "fg": "syn-variable",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.64
        },
        {
          "fg": "syn-variable",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 10.25
        },
        {
          "fg": "syn-comment",
          "bg": "surface",
          "mode": "light",
          "min": 4.5,
          "measured": 5.88
        },
        {
          "fg": "syn-comment",
          "bg": "surface-raised",
          "mode": "dark",
          "min": 4.5,
          "measured": 5.12
        },
        {
          "fg": "syn-docstring",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 8.46
        },
        {
          "fg": "syn-docstring",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 10.69
        },
        {
          "fg": "status-err",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 7.53
        },
        {
          "fg": "status-warn",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.58
        },
        {
          "fg": "status-ok",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.62
        },
        {
          "fg": "status-info",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.64
        }
      ]
    },
    "mono": {
      "meta": {
        "name": "Monochrome",
        "slug": "mono",
        "blurb": "neutral grayscale — interaction reads as inverted ink fills and weight, the maker's mark is the one pure black/white, status colors survive for safety",
        "modes": {
          "light": "Print — ink on paper",
          "dark": "Negative — the developed plate"
        }
      },
      "palette": {
        "bg": {
          "light": "#f7f7f7",
          "dark": "#121212",
          "ansi": "unspecified-bg",
          "notes": "neutral near-white / near-black, never pure"
        },
        "bg-subtle": {
          "light": "#efefef",
          "dark": "#191919",
          "x256": {
            "light": "color-255",
            "dark": "color-234"
          },
          "notes": "code fills, zebra"
        },
        "surface": {
          "light": "#e7e7e7",
          "dark": "#202020",
          "x256": {
            "light": "color-254",
            "dark": "color-235"
          },
          "notes": "card / panel fill"
        },
        "surface-raised": {
          "light": "#ffffff",
          "dark": "#2a2a2a",
          "x256": {
            "dark": "color-237"
          },
          "notes": "plates, modals, dropdowns"
        },
        "text": {
          "light": "#212121",
          "dark": "#d9d9d9",
          "ansi": "unspecified-fg",
          "notes": "body (AAA)"
        },
        "text-muted": {
          "light": "#545454",
          "dark": "#a3a3a3",
          "notes": "meta (AA)"
        },
        "text-heading": {
          "light": "#0f0f0f",
          "dark": "#f5f5f5",
          "notes": "titles (AAA)"
        },
        "text-faint": {
          "light": "#828282",
          "dark": "#6e6e6e",
          "notes": "decoration only"
        },
        "accent": {
          "light": "#1a1a1a",
          "dark": "#e6e6e6",
          "ansi": "bright-yellow",
          "notes": "the interactive ink — links and controls render as inverted fills; ANSI 11 stays the accent"
        },
        "accent-hover": {
          "light": "#3d3d3d",
          "dark": "#ffffff",
          "notes": ":hover / :active — the fill lifts one step"
        },
        "brand": {
          "light": "#000000",
          "dark": "#ffffff",
          "notes": "the datum mark is the one PURE black / white in the theme"
        },
        "contour": {
          "light": "#4a4a4a",
          "dark": "#8f8f8f",
          "notes": "structural linework, mid-gray"
        },
        "border": {
          "light": "#d6d6d6",
          "dark": "#2e2e2e",
          "notes": "default 1px hairline"
        },
        "border-strong": {
          "light": "#ababab",
          "dark": "#454545",
          "notes": "table heads, field hover"
        },
        "decorator": {
          "light": "#9e9e9e",
          "dark": "#4a4a4a",
          "notes": "graticule / dashed rules"
        },
        "accent-subtle": {
          "light": "#e9e9e9",
          "dark": "#232323",
          "notes": "opaque approximation of accent @ ~8-12% on bg; CSS emits rgba"
        },
        "selection-bg": {
          "light": "#dcdcdc",
          "dark": "#383838",
          "notes": "text selection"
        },
        "cursor": {
          "light": "#1a1a1a",
          "dark": "#e6e6e6",
          "notes": "input cursor (matches accent)"
        },
        "scrim": {
          "light": "#141414",
          "dark": "#000000",
          "notes": "overlay scrim ink; CSS emits rgba (light 0.4, dark 0.55)"
        }
      },
      "syntax": {
        "syn-keyword": {
          "light": "#0f0f0f",
          "dark": "#f0f0f0",
          "weight": 700,
          "gray": "near-ink, bold"
        },
        "syn-string": {
          "light": "#3d3d3d",
          "dark": "#c6c6c6",
          "gray": "step 2"
        },
        "syn-number": {
          "light": "#454545",
          "dark": "#b8b8b8",
          "gray": "step 3"
        },
        "syn-function": {
          "light": "#1c1c1c",
          "dark": "#e3e3e3",
          "weight": 700,
          "gray": "near-ink, bold"
        },
        "syn-builtin": {
          "light": "#454545",
          "dark": "#b8b8b8",
          "style": "italic",
          "gray": "step 3, italic"
        },
        "syn-type": {
          "light": "#2b2b2b",
          "dark": "#d1d1d1",
          "gray": "step 1"
        },
        "syn-variable": {
          "light": "#4f4f4f",
          "dark": "#adadad",
          "gray": "step 4"
        },
        "syn-comment": {
          "light": "#666666",
          "dark": "#929292",
          "style": "italic",
          "gray": "faint, italic"
        },
        "syn-docstring": {
          "light": "#616161",
          "dark": "#9e9e9e",
          "style": "italic",
          "gray": "step 5, italic"
        }
      },
      "status": {
        "status-err": {
          "light": "#a60000",
          "dark": "#f0685f",
          "ansi": "red",
          "notes": "chromatic on purpose — safety survives grayscale"
        },
        "status-warn": {
          "light": "#884900",
          "dark": "#d9b34a",
          "ansi": "yellow"
        },
        "status-ok": {
          "light": "#006800",
          "dark": "#6bbf6b",
          "ansi": "green"
        },
        "status-info": {
          "light": "#005e8b",
          "dark": "#5fb8cf",
          "ansi": "blue"
        }
      },
      "ansi": [
        {
          "name": "black",
          "light": "#212121",
          "dark": "#121212",
          "role": "text/bg inversion"
        },
        {
          "name": "red",
          "light": "#a60000",
          "dark": "#f0685f",
          "role": "errors (chromatic)"
        },
        {
          "name": "green",
          "light": "#006800",
          "dark": "#6bbf6b",
          "role": "ok (chromatic)"
        },
        {
          "name": "yellow",
          "light": "#884900",
          "dark": "#d9b34a",
          "role": "warnings (chromatic)"
        },
        {
          "name": "blue",
          "light": "#454545",
          "dark": "#b8b8b8",
          "role": "gray step"
        },
        {
          "name": "magenta",
          "light": "#1c1c1c",
          "dark": "#e3e3e3",
          "role": "gray step (near-ink)"
        },
        {
          "name": "cyan",
          "light": "#2b2b2b",
          "dark": "#d1d1d1",
          "role": "gray step"
        },
        {
          "name": "white",
          "light": "#545454",
          "dark": "#c4c4c4",
          "role": "ANSI 7"
        },
        {
          "name": "bright-black",
          "light": "#828282",
          "dark": "#6e6e6e",
          "role": "faint"
        },
        {
          "name": "bright-red",
          "light": "#b60000",
          "dark": "#ff7f7f",
          "role": "red-warmer (chromatic)"
        },
        {
          "name": "bright-green",
          "light": "#316500",
          "dark": "#70b900",
          "role": "green-warmer (chromatic)"
        },
        {
          "name": "bright-yellow",
          "light": "#1a1a1a",
          "dark": "#e6e6e6",
          "role": "accent (intentional override — ANSI 11)"
        },
        {
          "name": "bright-blue",
          "light": "#3d3d3d",
          "dark": "#c6c6c6",
          "role": "gray step"
        },
        {
          "name": "bright-magenta",
          "light": "#0f0f0f",
          "dark": "#f0f0f0",
          "role": "gray step (ink)"
        },
        {
          "name": "bright-cyan",
          "light": "#005e8b",
          "dark": "#5fb8cf",
          "role": "info (chromatic)"
        },
        {
          "name": "bright-white",
          "light": "#212121",
          "dark": "#f5f5f5",
          "role": "ANSI 15"
        }
      ],
      "pairs": {
        "accent": {
          "fg": "bg",
          "min": 4.5,
          "label": "label on the inverted ink fill — primary button"
        },
        "accent-hover": {
          "fg": "bg",
          "min": 4.5,
          "label": "label on the lifted :hover fill"
        },
        "brand": {
          "fg": "bg",
          "min": 4.5,
          "label": "label on the pure datum fill"
        },
        "bg-subtle": {
          "fg": "text",
          "min": 7,
          "label": "body on the subtle fill"
        },
        "surface": {
          "fg": "text",
          "min": 7,
          "label": "body on a card surface"
        },
        "surface-raised": {
          "fg": "text",
          "min": 7,
          "label": "body on a raised plate / modal"
        },
        "selection-bg": {
          "fg": "text",
          "min": 7,
          "label": "selected text on the selection highlight"
        }
      },
      "swatchContrast": {
        "light": {
          "text": {
            "ratio": 15.03,
            "tag": "AAA"
          },
          "text-muted": {
            "ratio": 7.07,
            "tag": "AAA"
          },
          "text-heading": {
            "ratio": 17.89,
            "tag": "AAA"
          },
          "text-faint": {
            "ratio": 3.59,
            "tag": "fail"
          },
          "accent": {
            "ratio": 16.25,
            "tag": "AAA"
          },
          "accent-hover": {
            "ratio": 10.14,
            "tag": "AAA"
          },
          "brand": {
            "ratio": 19.6,
            "tag": "AAA"
          },
          "contour": {
            "ratio": 8.27,
            "tag": "AAA"
          },
          "syn-keyword": {
            "ratio": 17.89,
            "tag": "AAA"
          },
          "syn-string": {
            "ratio": 10.14,
            "tag": "AAA"
          },
          "syn-number": {
            "ratio": 8.95,
            "tag": "AAA"
          },
          "syn-function": {
            "ratio": 15.91,
            "tag": "AAA"
          },
          "syn-builtin": {
            "ratio": 8.95,
            "tag": "AAA"
          },
          "syn-type": {
            "ratio": 13.22,
            "tag": "AAA"
          },
          "syn-variable": {
            "ratio": 7.65,
            "tag": "AAA"
          },
          "syn-comment": {
            "ratio": 5.36,
            "tag": "AA"
          },
          "syn-docstring": {
            "ratio": 5.78,
            "tag": "AA"
          },
          "status-err": {
            "ratio": 7.48,
            "tag": "AAA"
          },
          "status-warn": {
            "ratio": 6.53,
            "tag": "AA"
          },
          "status-ok": {
            "ratio": 6.58,
            "tag": "AA"
          },
          "status-info": {
            "ratio": 6.59,
            "tag": "AA"
          }
        },
        "dark": {
          "text": {
            "ratio": 13.27,
            "tag": "AAA"
          },
          "text-muted": {
            "ratio": 7.43,
            "tag": "AAA"
          },
          "text-heading": {
            "ratio": 17.18,
            "tag": "AAA"
          },
          "text-faint": {
            "ratio": 3.67,
            "tag": "fail"
          },
          "accent": {
            "ratio": 15.01,
            "tag": "AAA"
          },
          "accent-hover": {
            "ratio": 18.73,
            "tag": "AAA"
          },
          "brand": {
            "ratio": 18.73,
            "tag": "AAA"
          },
          "contour": {
            "ratio": 5.79,
            "tag": "AA"
          },
          "syn-keyword": {
            "ratio": 16.44,
            "tag": "AAA"
          },
          "syn-string": {
            "ratio": 10.97,
            "tag": "AAA"
          },
          "syn-number": {
            "ratio": 9.44,
            "tag": "AAA"
          },
          "syn-function": {
            "ratio": 14.6,
            "tag": "AAA"
          },
          "syn-builtin": {
            "ratio": 9.44,
            "tag": "AAA"
          },
          "syn-type": {
            "ratio": 12.27,
            "tag": "AAA"
          },
          "syn-variable": {
            "ratio": 8.35,
            "tag": "AAA"
          },
          "syn-comment": {
            "ratio": 6.02,
            "tag": "AA"
          },
          "syn-docstring": {
            "ratio": 6.99,
            "tag": "AA"
          },
          "status-err": {
            "ratio": 6.11,
            "tag": "AA"
          },
          "status-warn": {
            "ratio": 9.36,
            "tag": "AAA"
          },
          "status-ok": {
            "ratio": 8.29,
            "tag": "AAA"
          },
          "status-info": {
            "ratio": 8.25,
            "tag": "AAA"
          }
        }
      },
      "contrastPairs": [
        {
          "fg": "text",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 15.03
        },
        {
          "fg": "text",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 13.27
        },
        {
          "fg": "text-heading",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 17.89
        },
        {
          "fg": "text-heading",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 17.18
        },
        {
          "fg": "text-muted",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 7.07
        },
        {
          "fg": "text-muted",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 7.43
        },
        {
          "fg": "accent",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 16.25
        },
        {
          "fg": "accent",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 15.01
        },
        {
          "fg": "contour",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 8.27
        },
        {
          "fg": "contour",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 5.79
        },
        {
          "fg": "syn-keyword",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 17.89
        },
        {
          "fg": "syn-keyword",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 16.44
        },
        {
          "fg": "syn-string",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 10.14
        },
        {
          "fg": "syn-string",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 10.97
        },
        {
          "fg": "syn-function",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 15.91
        },
        {
          "fg": "syn-function",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 14.6
        },
        {
          "fg": "syn-type",
          "bg": "bg",
          "mode": "light",
          "min": 7,
          "measured": 13.22
        },
        {
          "fg": "syn-type",
          "bg": "bg",
          "mode": "dark",
          "min": 7,
          "measured": 12.27
        },
        {
          "fg": "syn-number",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 8.95
        },
        {
          "fg": "syn-number",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 9.44
        },
        {
          "fg": "syn-builtin",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 8.95
        },
        {
          "fg": "syn-builtin",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 9.44
        },
        {
          "fg": "syn-variable",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 7.65
        },
        {
          "fg": "syn-variable",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 8.35
        },
        {
          "fg": "syn-comment",
          "bg": "surface",
          "mode": "light",
          "min": 4.5,
          "measured": 4.64
        },
        {
          "fg": "syn-comment",
          "bg": "surface-raised",
          "mode": "dark",
          "min": 4.5,
          "measured": 4.61
        },
        {
          "fg": "syn-docstring",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 5.78
        },
        {
          "fg": "syn-docstring",
          "bg": "bg",
          "mode": "dark",
          "min": 4.5,
          "measured": 6.99
        },
        {
          "fg": "status-err",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 7.48
        },
        {
          "fg": "status-warn",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.53
        },
        {
          "fg": "status-ok",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.58
        },
        {
          "fg": "status-info",
          "bg": "bg",
          "mode": "light",
          "min": 4.5,
          "measured": 6.59
        }
      ]
    }
  }
};

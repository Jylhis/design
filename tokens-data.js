// tokens-data.js — GENERATED from tokens.json. Do not edit by hand.
// Used by index.html to render dynamic color swatches and token tables.
// Includes derived data: contrastPairs (every fg×bg×mode), swatchContrast
// (one ratio per fg role per mode against bg).
export const tokens = {
  "meta": {
    "name": "Jylhis Design System",
    "version": "0.3.0"
  },
  "groups": {
    "paperstock": {
      "label": "Paperstock",
      "blurb": "the page itself — backgrounds and card surfaces",
      "members": [
        "bg",
        "bg-subtle",
        "surface",
        "surface-raised"
      ]
    },
    "ink": {
      "label": "Ink",
      "blurb": "what is printed on the page — text in every weight",
      "members": [
        "text-heading",
        "text",
        "text-muted",
        "text-faint"
      ]
    },
    "copper": {
      "label": "Copper",
      "blurb": "the single accent — links, focus rings, the maker's mark",
      "members": [
        "accent",
        "accent-hover",
        "brand",
        "accent-subtle",
        "selection-bg",
        "cursor"
      ]
    },
    "linen": {
      "label": "Linen",
      "blurb": "rules and edges — borders and decorator dashes",
      "members": [
        "border",
        "border-strong",
        "decorator"
      ]
    },
    "modus": {
      "label": "Modus",
      "blurb": "Modus role taxonomy — keyword, string, type, comment — with hex values hue-tuned for warm paper and dark roast (not the upstream Modus values)",
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
      "blurb": "status colors — error, warning, ok, info; reuses the Modus accents",
      "members": [
        "status-err",
        "status-warn",
        "status-ok",
        "status-info"
      ]
    },
    "spectrum": {
      "label": "Spectrum",
      "blurb": "the 16-slot ANSI terminal palette; slot 11 is intentionally overridden to brand copper",
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
      "light": "#faf7f2",
      "dark": "#1a1714",
      "notes": "warm paper / dark roast"
    },
    "bg-subtle": {
      "light": "#f0ebe3",
      "dark": "#242019"
    },
    "surface": {
      "light": "#e8e1d6",
      "dark": "#2a2520",
      "notes": "card fill"
    },
    "surface-raised": {
      "light": "#fefdfb",
      "dark": "#363230",
      "notes": "modals, elevated"
    },
    "text": {
      "light": "#2c2825",
      "dark": "#e8e0d4",
      "notes": "body (AAA)"
    },
    "text-muted": {
      "light": "#6b5f54",
      "dark": "#b0a496",
      "notes": "meta (AA / AAA)"
    },
    "text-heading": {
      "light": "#1e1b18",
      "dark": "#f0eae0",
      "notes": "titles (AAA)"
    },
    "text-faint": {
      "light": "#8a7f72",
      "dark": "#8a7f72",
      "notes": "decorators, disabled only"
    },
    "accent": {
      "light": "#9a5a2a",
      "dark": "#e89b5e",
      "ansi": "bright-yellow",
      "notes": "copper UI accent (AA / AAA); ANSI slot 11 is always brand copper"
    },
    "accent-hover": {
      "light": "#7a4622",
      "dark": "#f5b07a"
    },
    "brand": {
      "light": "#b5703c",
      "dark": "#d4884a",
      "notes": "literal logo copper (large marks)"
    },
    "border": {
      "light": "#d5cec4",
      "dark": "#3d3830"
    },
    "border-strong": {
      "light": "#b0a898",
      "dark": "#5a5248"
    },
    "decorator": {
      "light": "#c4baa8",
      "dark": "#4a4338",
      "notes": "dashed rules"
    },
    "accent-subtle": {
      "light": "#f0e6da",
      "dark": "#2e2520",
      "notes": "opaque approximation of accent @ 12-15% on bg"
    },
    "selection-bg": {
      "light": "#e8d4b8",
      "dark": "#4a3a28",
      "notes": "text selection highlight"
    },
    "cursor": {
      "light": "#9a5a2a",
      "dark": "#e89b5e",
      "notes": "input cursor (matches accent)"
    }
  },
  "syntax": {
    "syn-keyword": {
      "light": "#4a2d80",
      "dark": "#c8a5ff",
      "modus": "from magenta-cooler — warmed indigo"
    },
    "syn-string": {
      "light": "#3d5a1f",
      "dark": "#b3c785",
      "modus": "from blue-cooler — olive/sage"
    },
    "syn-number": {
      "light": "#1f4d8a",
      "dark": "#a8b4dc",
      "modus": "from blue-warmer — muted indigo"
    },
    "syn-function": {
      "light": "#8a2348",
      "dark": "#f0a8c3",
      "modus": "from magenta — rose-wine"
    },
    "syn-builtin": {
      "light": "#6f1f6a",
      "dark": "#e3a0d8",
      "modus": "from magenta-warmer — deep magenta"
    },
    "syn-type": {
      "light": "#134a4a",
      "dark": "#80c8b3",
      "modus": "from cyan-cooler — desaturated teal"
    },
    "syn-variable": {
      "light": "#2a4a6a",
      "dark": "#95b3cc",
      "modus": "from cyan — slate-blue"
    },
    "syn-comment": {
      "light": "#7e6c4d",
      "dark": "#9c8c6e",
      "modus": "from red-faint — warm tan (italic)"
    },
    "syn-docstring": {
      "light": "#2a5a3a",
      "dark": "#9bbf9b",
      "modus": "from green-faint — moss/sage"
    }
  },
  "status": {
    "status-err": {
      "light": "#a60000",
      "dark": "#ff5f59",
      "ansi": "red",
      "modus": "red"
    },
    "status-warn": {
      "light": "#6f5500",
      "dark": "#d0bc00",
      "ansi": "yellow",
      "modus": "yellow"
    },
    "status-ok": {
      "light": "#006800",
      "dark": "#44bc44",
      "ansi": "green",
      "modus": "green"
    },
    "status-info": {
      "light": "#0031a9",
      "dark": "#2fafff",
      "ansi": "blue",
      "modus": "blue"
    }
  },
  "ansi": [
    {
      "name": "black",
      "light": "#2c2825",
      "dark": "#1a1714",
      "role": "text/bg inversion"
    },
    {
      "name": "red",
      "light": "#a60000",
      "dark": "#ff5f59",
      "role": "Modus red — errors"
    },
    {
      "name": "green",
      "light": "#006800",
      "dark": "#44bc44",
      "role": "Modus green — ok"
    },
    {
      "name": "yellow",
      "light": "#6f5500",
      "dark": "#d0bc00",
      "role": "Modus yellow — warnings"
    },
    {
      "name": "blue",
      "light": "#0031a9",
      "dark": "#2fafff",
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
      "light": "#005f5f",
      "dark": "#6ae4b9",
      "role": "Modus cyan-cooler"
    },
    {
      "name": "white",
      "light": "#6b5f54",
      "dark": "#e8e0d4",
      "role": "ANSI 7 — text-muted on paper, surface-faint on roast"
    },
    {
      "name": "bright-black",
      "light": "#8a7f72",
      "dark": "#6b6157",
      "role": "faint"
    },
    {
      "name": "bright-red",
      "light": "#972500",
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
      "light": "#b5703c",
      "dark": "#e89b5e",
      "role": "brand copper (intentional override)"
    },
    {
      "name": "bright-blue",
      "light": "#3548cf",
      "dark": "#79a8ff",
      "role": "Modus blue-warmer"
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
      "light": "#2c2825",
      "dark": "#f0eae0",
      "role": "ANSI 15 — text on paper, fg-bright on roast"
    }
  ],
  "typography": {
    "body": {
      "family": "Literata",
      "fallback": "Charter, \"Bitstream Charter\", Georgia, \"Noto Serif\", serif",
      "sizeBase": "1.125rem",
      "lineHeight": 1.65
    },
    "mono": {
      "family": "JetBrains Mono",
      "fallback": "\"IBM Plex Mono\", \"Cascadia Code\", \"Fira Code\", \"Source Code Pro\", \"Courier New\", monospace"
    },
    "heading": {
      "inherits": "mono",
      "lineHeight": 1.25,
      "letterSpacing": "0.01em"
    },
    "tuiFallback": "JetBrains Mono, Iosevka, IBM Plex Mono, Fira Mono, DejaVu Sans Mono, monospace",
    "scale": [
      2,
      1.4,
      1.15,
      1,
      0.85,
      0.75,
      0.72,
      0.65
    ]
  },
  "spacing": {
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
  "density": {
    "comfortable": {
      "lineHeight": 1.65,
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
      "duration": "420ms",
      "css": "cubic-bezier(0.34, 1.25, 0.64, 1)",
      "hypr": "0.34,1.25,0.64,1"
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
  "contrast": [
    {
      "fg": "text",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA body text (light)"
    },
    {
      "fg": "text",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA body text (dark)"
    },
    {
      "fg": "text-heading",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA headings (light)"
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA meta (light)"
    },
    {
      "fg": "text-muted",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA meta (dark)"
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA accent on paper"
    },
    {
      "fg": "accent",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA accent on dark"
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA syn-keyword (light)"
    },
    {
      "fg": "syn-keyword",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-keyword (dark)"
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA syn-string (light)"
    },
    {
      "fg": "syn-string",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-string (dark)"
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA syn-function (light)"
    },
    {
      "fg": "syn-function",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-function (dark)"
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "light",
      "min": 7,
      "label": "AAA syn-type (light)"
    },
    {
      "fg": "syn-type",
      "bg": "bg",
      "mode": "dark",
      "min": 7,
      "label": "AAA syn-type (dark)"
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-number (light)"
    },
    {
      "fg": "syn-number",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-number (dark)"
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-builtin (light)"
    },
    {
      "fg": "syn-builtin",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-builtin (dark)"
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-variable (light)"
    },
    {
      "fg": "syn-variable",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-variable (dark)"
    },
    {
      "fg": "syn-comment",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-comment (light)"
    },
    {
      "fg": "syn-comment",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-comment (dark)"
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "light",
      "min": 4.5,
      "label": "AA syn-docstring (light)"
    },
    {
      "fg": "syn-docstring",
      "bg": "bg",
      "mode": "dark",
      "min": 4.5,
      "label": "AA syn-docstring (dark)"
    }
  ],
  "contrastPairs": [
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "bg",
      "fgHex": "#1e1b18",
      "bgHex": "#faf7f2",
      "ratio": 16.04,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "bg-subtle",
      "fgHex": "#1e1b18",
      "bgHex": "#f0ebe3",
      "ratio": 14.45,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "surface",
      "fgHex": "#1e1b18",
      "bgHex": "#e8e1d6",
      "ratio": 13.2,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-heading",
      "bg": "surface-raised",
      "fgHex": "#1e1b18",
      "bgHex": "#fefdfb",
      "ratio": 16.86,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "bg",
      "fgHex": "#2c2825",
      "bgHex": "#faf7f2",
      "ratio": 13.67,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "bg-subtle",
      "fgHex": "#2c2825",
      "bgHex": "#f0ebe3",
      "ratio": 12.31,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "surface",
      "fgHex": "#2c2825",
      "bgHex": "#e8e1d6",
      "ratio": 11.25,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text",
      "bg": "surface-raised",
      "fgHex": "#2c2825",
      "bgHex": "#fefdfb",
      "ratio": 14.37,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "bg",
      "fgHex": "#6b5f54",
      "bgHex": "#faf7f2",
      "ratio": 5.8,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "bg-subtle",
      "fgHex": "#6b5f54",
      "bgHex": "#f0ebe3",
      "ratio": 5.22,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "surface",
      "fgHex": "#6b5f54",
      "bgHex": "#e8e1d6",
      "ratio": 4.77,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-muted",
      "bg": "surface-raised",
      "fgHex": "#6b5f54",
      "bgHex": "#fefdfb",
      "ratio": 6.09,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "bg",
      "fgHex": "#8a7f72",
      "bgHex": "#faf7f2",
      "ratio": 3.67,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "bg-subtle",
      "fgHex": "#8a7f72",
      "bgHex": "#f0ebe3",
      "ratio": 3.3,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "surface",
      "fgHex": "#8a7f72",
      "bgHex": "#e8e1d6",
      "ratio": 3.02,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "text-faint",
      "bg": "surface-raised",
      "fgHex": "#8a7f72",
      "bgHex": "#fefdfb",
      "ratio": 3.85,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "bg",
      "fgHex": "#9a5a2a",
      "bgHex": "#faf7f2",
      "ratio": 5.08,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "bg-subtle",
      "fgHex": "#9a5a2a",
      "bgHex": "#f0ebe3",
      "ratio": 4.57,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "surface",
      "fgHex": "#9a5a2a",
      "bgHex": "#e8e1d6",
      "ratio": 4.18,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "accent",
      "bg": "surface-raised",
      "fgHex": "#9a5a2a",
      "bgHex": "#fefdfb",
      "ratio": 5.34,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "bg",
      "fgHex": "#7a4622",
      "bgHex": "#faf7f2",
      "ratio": 7.21,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "bg-subtle",
      "fgHex": "#7a4622",
      "bgHex": "#f0ebe3",
      "ratio": 6.49,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "surface",
      "fgHex": "#7a4622",
      "bgHex": "#e8e1d6",
      "ratio": 5.93,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "accent-hover",
      "bg": "surface-raised",
      "fgHex": "#7a4622",
      "bgHex": "#fefdfb",
      "ratio": 7.58,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "bg",
      "fgHex": "#b5703c",
      "bgHex": "#faf7f2",
      "ratio": 3.67,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "bg-subtle",
      "fgHex": "#b5703c",
      "bgHex": "#f0ebe3",
      "ratio": 3.31,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "surface",
      "fgHex": "#b5703c",
      "bgHex": "#e8e1d6",
      "ratio": 3.02,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "brand",
      "bg": "surface-raised",
      "fgHex": "#b5703c",
      "bgHex": "#fefdfb",
      "ratio": 3.86,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "bg",
      "fgHex": "#f0e6da",
      "bgHex": "#faf7f2",
      "ratio": 1.15,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "bg-subtle",
      "fgHex": "#f0e6da",
      "bgHex": "#f0ebe3",
      "ratio": 1.04,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "surface",
      "fgHex": "#f0e6da",
      "bgHex": "#e8e1d6",
      "ratio": 1.05,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "accent-subtle",
      "bg": "surface-raised",
      "fgHex": "#f0e6da",
      "bgHex": "#fefdfb",
      "ratio": 1.21,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "bg",
      "fgHex": "#e8d4b8",
      "bgHex": "#faf7f2",
      "ratio": 1.35,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "bg-subtle",
      "fgHex": "#e8d4b8",
      "bgHex": "#f0ebe3",
      "ratio": 1.22,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "surface",
      "fgHex": "#e8d4b8",
      "bgHex": "#e8e1d6",
      "ratio": 1.11,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "selection-bg",
      "bg": "surface-raised",
      "fgHex": "#e8d4b8",
      "bgHex": "#fefdfb",
      "ratio": 1.42,
      "tag": "fail"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "bg",
      "fgHex": "#9a5a2a",
      "bgHex": "#faf7f2",
      "ratio": 5.08,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "bg-subtle",
      "fgHex": "#9a5a2a",
      "bgHex": "#f0ebe3",
      "ratio": 4.57,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "surface",
      "fgHex": "#9a5a2a",
      "bgHex": "#e8e1d6",
      "ratio": 4.18,
      "tag": "AA Large"
    },
    {
      "mode": "light",
      "fg": "cursor",
      "bg": "surface-raised",
      "fgHex": "#9a5a2a",
      "bgHex": "#fefdfb",
      "ratio": 5.34,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "bg",
      "fgHex": "#a60000",
      "bgHex": "#faf7f2",
      "ratio": 7.5,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "bg-subtle",
      "fgHex": "#a60000",
      "bgHex": "#f0ebe3",
      "ratio": 6.75,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "surface",
      "fgHex": "#a60000",
      "bgHex": "#e8e1d6",
      "ratio": 6.17,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-err",
      "bg": "surface-raised",
      "fgHex": "#a60000",
      "bgHex": "#fefdfb",
      "ratio": 7.88,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "bg",
      "fgHex": "#6f5500",
      "bgHex": "#faf7f2",
      "ratio": 6.6,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "bg-subtle",
      "fgHex": "#6f5500",
      "bgHex": "#f0ebe3",
      "ratio": 5.95,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "surface",
      "fgHex": "#6f5500",
      "bgHex": "#e8e1d6",
      "ratio": 5.44,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-warn",
      "bg": "surface-raised",
      "fgHex": "#6f5500",
      "bgHex": "#fefdfb",
      "ratio": 6.94,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "bg",
      "fgHex": "#006800",
      "bgHex": "#faf7f2",
      "ratio": 6.59,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "bg-subtle",
      "fgHex": "#006800",
      "bgHex": "#f0ebe3",
      "ratio": 5.94,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "surface",
      "fgHex": "#006800",
      "bgHex": "#e8e1d6",
      "ratio": 5.43,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-ok",
      "bg": "surface-raised",
      "fgHex": "#006800",
      "bgHex": "#fefdfb",
      "ratio": 6.93,
      "tag": "AA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "bg",
      "fgHex": "#0031a9",
      "bgHex": "#faf7f2",
      "ratio": 9.77,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "bg-subtle",
      "fgHex": "#0031a9",
      "bgHex": "#f0ebe3",
      "ratio": 8.79,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "surface",
      "fgHex": "#0031a9",
      "bgHex": "#e8e1d6",
      "ratio": 8.04,
      "tag": "AAA"
    },
    {
      "mode": "light",
      "fg": "status-info",
      "bg": "surface-raised",
      "fgHex": "#0031a9",
      "bgHex": "#fefdfb",
      "ratio": 10.27,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "bg",
      "fgHex": "#f0eae0",
      "bgHex": "#1a1714",
      "ratio": 14.92,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "bg-subtle",
      "fgHex": "#f0eae0",
      "bgHex": "#242019",
      "ratio": 13.55,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "surface",
      "fgHex": "#f0eae0",
      "bgHex": "#2a2520",
      "ratio": 12.68,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-heading",
      "bg": "surface-raised",
      "fgHex": "#f0eae0",
      "bgHex": "#363230",
      "ratio": 10.6,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "bg",
      "fgHex": "#e8e0d4",
      "bgHex": "#1a1714",
      "ratio": 13.64,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "bg-subtle",
      "fgHex": "#e8e0d4",
      "bgHex": "#242019",
      "ratio": 12.38,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "surface",
      "fgHex": "#e8e0d4",
      "bgHex": "#2a2520",
      "ratio": 11.59,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text",
      "bg": "surface-raised",
      "fgHex": "#e8e0d4",
      "bgHex": "#363230",
      "ratio": 9.69,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "bg",
      "fgHex": "#b0a496",
      "bgHex": "#1a1714",
      "ratio": 7.31,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "bg-subtle",
      "fgHex": "#b0a496",
      "bgHex": "#242019",
      "ratio": 6.63,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "surface",
      "fgHex": "#b0a496",
      "bgHex": "#2a2520",
      "ratio": 6.21,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "text-muted",
      "bg": "surface-raised",
      "fgHex": "#b0a496",
      "bgHex": "#363230",
      "ratio": 5.19,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "bg",
      "fgHex": "#8a7f72",
      "bgHex": "#1a1714",
      "ratio": 4.56,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "bg-subtle",
      "fgHex": "#8a7f72",
      "bgHex": "#242019",
      "ratio": 4.14,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "surface",
      "fgHex": "#8a7f72",
      "bgHex": "#2a2520",
      "ratio": 3.87,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "text-faint",
      "bg": "surface-raised",
      "fgHex": "#8a7f72",
      "bgHex": "#363230",
      "ratio": 3.24,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "bg",
      "fgHex": "#e89b5e",
      "bgHex": "#1a1714",
      "ratio": 7.89,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "bg-subtle",
      "fgHex": "#e89b5e",
      "bgHex": "#242019",
      "ratio": 7.16,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "surface",
      "fgHex": "#e89b5e",
      "bgHex": "#2a2520",
      "ratio": 6.71,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "accent",
      "bg": "surface-raised",
      "fgHex": "#e89b5e",
      "bgHex": "#363230",
      "ratio": 5.61,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "bg",
      "fgHex": "#f5b07a",
      "bgHex": "#1a1714",
      "ratio": 9.67,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "bg-subtle",
      "fgHex": "#f5b07a",
      "bgHex": "#242019",
      "ratio": 8.78,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "surface",
      "fgHex": "#f5b07a",
      "bgHex": "#2a2520",
      "ratio": 8.22,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "accent-hover",
      "bg": "surface-raised",
      "fgHex": "#f5b07a",
      "bgHex": "#363230",
      "ratio": 6.87,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "bg",
      "fgHex": "#d4884a",
      "bgHex": "#1a1714",
      "ratio": 6.31,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "bg-subtle",
      "fgHex": "#d4884a",
      "bgHex": "#242019",
      "ratio": 5.73,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "surface",
      "fgHex": "#d4884a",
      "bgHex": "#2a2520",
      "ratio": 5.36,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "brand",
      "bg": "surface-raised",
      "fgHex": "#d4884a",
      "bgHex": "#363230",
      "ratio": 4.48,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "bg",
      "fgHex": "#2e2520",
      "bgHex": "#1a1714",
      "ratio": 1.19,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "bg-subtle",
      "fgHex": "#2e2520",
      "bgHex": "#242019",
      "ratio": 1.08,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "surface",
      "fgHex": "#2e2520",
      "bgHex": "#2a2520",
      "ratio": 1.01,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "accent-subtle",
      "bg": "surface-raised",
      "fgHex": "#2e2520",
      "bgHex": "#363230",
      "ratio": 1.18,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "bg",
      "fgHex": "#4a3a28",
      "bgHex": "#1a1714",
      "ratio": 1.64,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "bg-subtle",
      "fgHex": "#4a3a28",
      "bgHex": "#242019",
      "ratio": 1.49,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "surface",
      "fgHex": "#4a3a28",
      "bgHex": "#2a2520",
      "ratio": 1.39,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "selection-bg",
      "bg": "surface-raised",
      "fgHex": "#4a3a28",
      "bgHex": "#363230",
      "ratio": 1.16,
      "tag": "fail"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "bg",
      "fgHex": "#e89b5e",
      "bgHex": "#1a1714",
      "ratio": 7.89,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "bg-subtle",
      "fgHex": "#e89b5e",
      "bgHex": "#242019",
      "ratio": 7.16,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "surface",
      "fgHex": "#e89b5e",
      "bgHex": "#2a2520",
      "ratio": 6.71,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "cursor",
      "bg": "surface-raised",
      "fgHex": "#e89b5e",
      "bgHex": "#363230",
      "ratio": 5.61,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "bg",
      "fgHex": "#ff5f59",
      "bgHex": "#1a1714",
      "ratio": 5.98,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "bg-subtle",
      "fgHex": "#ff5f59",
      "bgHex": "#242019",
      "ratio": 5.43,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "surface",
      "fgHex": "#ff5f59",
      "bgHex": "#2a2520",
      "ratio": 5.08,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-err",
      "bg": "surface-raised",
      "fgHex": "#ff5f59",
      "bgHex": "#363230",
      "ratio": 4.25,
      "tag": "AA Large"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "bg",
      "fgHex": "#d0bc00",
      "bgHex": "#1a1714",
      "ratio": 9.24,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "bg-subtle",
      "fgHex": "#d0bc00",
      "bgHex": "#242019",
      "ratio": 8.39,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "surface",
      "fgHex": "#d0bc00",
      "bgHex": "#2a2520",
      "ratio": 7.86,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-warn",
      "bg": "surface-raised",
      "fgHex": "#d0bc00",
      "bgHex": "#363230",
      "ratio": 6.57,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "bg",
      "fgHex": "#44bc44",
      "bgHex": "#1a1714",
      "ratio": 7.24,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "bg-subtle",
      "fgHex": "#44bc44",
      "bgHex": "#242019",
      "ratio": 6.58,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "surface",
      "fgHex": "#44bc44",
      "bgHex": "#2a2520",
      "ratio": 6.16,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-ok",
      "bg": "surface-raised",
      "fgHex": "#44bc44",
      "bgHex": "#363230",
      "ratio": 5.15,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "bg",
      "fgHex": "#2fafff",
      "bgHex": "#1a1714",
      "ratio": 7.39,
      "tag": "AAA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "bg-subtle",
      "fgHex": "#2fafff",
      "bgHex": "#242019",
      "ratio": 6.71,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "surface",
      "fgHex": "#2fafff",
      "bgHex": "#2a2520",
      "ratio": 6.28,
      "tag": "AA"
    },
    {
      "mode": "dark",
      "fg": "status-info",
      "bg": "surface-raised",
      "fgHex": "#2fafff",
      "bgHex": "#363230",
      "ratio": 5.25,
      "tag": "AA"
    }
  ],
  "swatchContrast": {
    "light": {
      "text-heading": {
        "ratio": 16.04,
        "tag": "AAA"
      },
      "text": {
        "ratio": 13.67,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 5.8,
        "tag": "AA"
      },
      "text-faint": {
        "ratio": 3.67,
        "tag": "AA Large"
      },
      "accent": {
        "ratio": 5.08,
        "tag": "AA"
      },
      "accent-hover": {
        "ratio": 7.21,
        "tag": "AAA"
      },
      "brand": {
        "ratio": 3.67,
        "tag": "AA Large"
      },
      "accent-subtle": {
        "ratio": 1.15,
        "tag": "fail"
      },
      "selection-bg": {
        "ratio": 1.35,
        "tag": "fail"
      },
      "cursor": {
        "ratio": 5.08,
        "tag": "AA"
      },
      "status-err": {
        "ratio": 7.5,
        "tag": "AAA"
      },
      "status-warn": {
        "ratio": 6.6,
        "tag": "AA"
      },
      "status-ok": {
        "ratio": 6.59,
        "tag": "AA"
      },
      "status-info": {
        "ratio": 9.77,
        "tag": "AAA"
      }
    },
    "dark": {
      "text-heading": {
        "ratio": 14.92,
        "tag": "AAA"
      },
      "text": {
        "ratio": 13.64,
        "tag": "AAA"
      },
      "text-muted": {
        "ratio": 7.31,
        "tag": "AAA"
      },
      "text-faint": {
        "ratio": 4.56,
        "tag": "AA"
      },
      "accent": {
        "ratio": 7.89,
        "tag": "AAA"
      },
      "accent-hover": {
        "ratio": 9.67,
        "tag": "AAA"
      },
      "brand": {
        "ratio": 6.31,
        "tag": "AA"
      },
      "accent-subtle": {
        "ratio": 1.19,
        "tag": "fail"
      },
      "selection-bg": {
        "ratio": 1.64,
        "tag": "fail"
      },
      "cursor": {
        "ratio": 7.89,
        "tag": "AAA"
      },
      "status-err": {
        "ratio": 5.98,
        "tag": "AA"
      },
      "status-warn": {
        "ratio": 9.24,
        "tag": "AAA"
      },
      "status-ok": {
        "ratio": 7.24,
        "tag": "AAA"
      },
      "status-info": {
        "ratio": 7.39,
        "tag": "AAA"
      }
    }
  }
};

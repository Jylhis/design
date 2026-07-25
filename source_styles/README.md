# source_styles/ — reference copies, not canonical

These files are **read-only reference copies** of the CSS used by the real
Astro site at [jylhis.com](https://jylhis.com). They are kept here so that
anyone working on the design system can see how the live site currently
uses the tokens, and so historical decisions (e.g. the pre-v2 font
stack) remain visible.

## Direction of truth

```
tokens.json  →  tokens.css  →  colors_and_type.css  →  jylhis.com (Astro)
```

- [`tokens.json`](../tokens.json) is the **canonical source** for every token value.
- [`tokens.md`](../tokens.md) is the human-readable companion spec derived
  from the same token contract.
- [`colors_and_type.css`](../colors_and_type.css) is the CSS
  implementation of that spec and is what downstream consumers import.
- `source_styles/` is a **snapshot** of what the live site shipped. It
  does not flow back into the system; if the live site drifts from
  `tokens.json`, that is a bug to fix on the site, not a reason to update
  tokens.

## Files

| File | Mirrors on jylhis.com |
|---|---|
| `global.css` | Design tokens + reset + link / skip / utility styles |
| `typography.css` | `@font-face`, font stacks, base scale |
| `content.css` | `.prose` markdown styling |
| `cv.css` | Code-editor line-numbered CV layout |

## Caveats

- `typography.css` still references the historical Source Serif 4 + IBM
  Plex Mono stack. The current design system pairs **Literata** (body)
  with **JetBrains Mono** (chrome). This file has not been updated
  because it documents what the site shipped at import time.
- Do not `@import` anything in `source_styles/` from a consumer project.
  Import [`colors_and_type.css`](../colors_and_type.css) instead.

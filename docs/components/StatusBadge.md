<!-- GENERATED from components/StatusBadge/ by scripts/generate.mjs. Do not edit by hand. -->
# StatusBadge

Uppercase project-status badge — status glyph + word, per the Alert glyph convention.

```jsx
import { StatusBadge } from "../../components/StatusBadge/StatusBadge.jsx";
```

## Anatomy

- project status

## Props — `StatusBadgeProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `status` | `"active" \| "archived" \| "experimental" \| "contributed"` |  | Project lifecycle state. Colors come from status tokens; each state renders an aria-hidden glyph (✓ ▪ △ ⑂) before the uppercase label. |
| `children` | `React.ReactNode` |  | Custom label; defaults to the status name |

## Accessibility

- Alert's glyph convention: glyph is aria-hidden; the visible word always carries the meaning.

## See also

- Specimen: [`components/StatusBadge/card.html`](../../components/StatusBadge/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

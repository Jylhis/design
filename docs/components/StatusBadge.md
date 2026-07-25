<!-- GENERATED from components/StatusBadge/ by scripts/generate.mjs. Do not edit by hand. -->
# StatusBadge

Uppercase project-status badge.

```jsx
import { StatusBadge } from "../../components/StatusBadge/StatusBadge.jsx";
```

## Anatomy

- project status

## Props — `StatusBadgeProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `status` | `"active" \| "archived" \| "experimental" \| "contributed"` |  | Project lifecycle state. Colors come from status tokens (with glyph-free uppercase label). |
| `children` | `React.ReactNode` |  | Custom label; defaults to the status name |

## See also

- Specimen: [`components/StatusBadge/card.html`](../../components/StatusBadge/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

<!-- GENERATED from components/Kbd/ by scripts/generate.mjs. Do not edit by hand. -->
# Kbd

Keyboard chip — 1px border, 2px bottom edge for the typewriter feel.

```jsx
import { Kbd } from "../../components/Kbd/Kbd.jsx";
```

## Anatomy

- single · chord
- accent · the canonical shortcut on the page

## Props — `KbdProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `keys` | `string[]` |  | Multiple keys render as a chord: ["⌘","K"] or ["g","t"] |
| `accent` | `boolean` |  | Accent variant — for the canonical shortcut on the page only |
| `children` | `React.ReactNode` |  | Single key label when `keys` is not given |

## See also

- Specimen: [`components/Kbd/card.html`](../../components/Kbd/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

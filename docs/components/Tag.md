<!-- GENERATED from components/Tag/ by scripts/generate.mjs. Do not edit by hand. -->
# Tag

Topic chip — lowercase mono, subtle background, 1px border.

```jsx
import { Tag } from "../../components/Tag/Tag.jsx";
```

## Anatomy

- static · linked (hover for accent)

## Props — `TagProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `href` | `string` |  | When set, renders as a link chip with hover accent |
| `children` | `React.ReactNode` |  |  |

## Props — `TagListProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `tags` | `string[]` |  | Tag labels, rendered as a wrapping row of chips |
| `hrefFor` | `(tag: string) => string` |  | When given, each chip links to hrefFor(tag) |

## See also

- Specimen: [`components/Tag/card.html`](../../components/Tag/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

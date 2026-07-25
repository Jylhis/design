<!-- GENERATED from components/Callout/ by scripts/generate.mjs. Do not edit by hand. -->
# Callout

Copper left-border callout — the "// currently" pattern from the homepage.

```jsx
import { Callout } from "../../components/Callout/Callout.jsx";
```

## Props — `CalloutProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `label` | `string` |  | Mono lowercase label, rendered with a leading "//" — e.g. "currently", "colophon" |
| `items` | `React.ReactNode[]` |  | List items, each rendered with a copper "›" marker |
| `children` | `React.ReactNode` |  | Free-form body used when `items` is not given |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` |  | Heading level for the label — set to place it correctly in the document outline (avoid skipping levels). Defaults to 3. |
| `attr` | `string]: unknown` | yes |  |

## See also

- Specimen: [`components/Callout/card.html`](../../components/Callout/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

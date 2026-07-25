<!-- GENERATED from components/Button/ by scripts/generate.mjs. Do not edit by hand. -->
# Button

Monospace button. Ghost is the default — copper fill is reserved for the one primary action on a page.

```jsx
import { Button } from "../../components/Button/Button.jsx";
```

## Anatomy

- primary · ghost · disabled · loading
- search trigger · link

## Props — `ButtonProps`

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`.

| prop | type | required | description |
|------|------|----------|-------------|
| `variant` | `"primary" \| "ghost" \| "link" \| "search"` |  | primary = copper fill; ghost = 1px border; link = bare accent text; search = search-trigger with kbd hint |
| `kbdHint` | `string` |  | Shortcut hint shown inside the search variant, e.g. "/" |
| `loading` | `boolean` |  | Sets aria-busy + disabled and appends a mono ellipsis — the system's spinner-free loading state |
| `children` | `React.ReactNode` |  |  |

## See also

- Specimen: [`components/Button/card.html`](../../components/Button/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

<!-- GENERATED from components/CvEntry/ by scripts/generate.mjs. Do not edit by hand. -->
# CvEntry

Code-editor CV entry — line numbers in the gutter, role/company/skills as source lines.

```jsx
import { CvEntry } from "../../components/CvEntry/CvEntry.jsx";
```

## Props — `CvEntryProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `role` | `string` | yes |  |
| `company` | `string` | yes |  |
| `date` | `string` |  | e.g. "May 2025 — present" |
| `location` | `string` |  | e.g. "Zürich" |
| `description` | `string` |  | One-line serif summary |
| `highlights` | `string[]` |  | Bullet highlights, each prefixed "·" |
| `skills` | `Record<string, string[]>` |  | Rendered as syntax-colored key: [values] lines, e.g. { languages: ["go","rust"] } |

## See also

- Specimen: [`components/CvEntry/card.html`](../../components/CvEntry/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

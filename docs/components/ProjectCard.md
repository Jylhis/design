<!-- GENERATED from components/ProjectCard/ by scripts/generate.mjs. Do not edit by hand. -->
# ProjectCard

Flat project card — 1px border, no shadow, mono title, serif description.

```jsx
import { ProjectCard } from "../../components/ProjectCard/ProjectCard.jsx";
```

## Props — `ProjectCardProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `title` | `string` | yes |  |
| `description` | `string` |  |  |
| `tags` | `string[]` |  | Topic chips, lowercase: ["nix", "flakes"] |
| `status` | `"active" \| "archived" \| "experimental" \| "contributed"` |  | Optional lifecycle badge in the top-right |
| `subtle` | `boolean` |  | Subtle variant — bg-subtle fill for secondary items |
| `href` | `string` |  | Makes the title a link |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` |  | Heading level for the card title — set to keep the document outline contiguous (avoid skipping levels). Defaults to 3. |

## See also

- Specimen: [`components/ProjectCard/card.html`](../../components/ProjectCard/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

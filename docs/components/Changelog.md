<!-- GENERATED from components/Changelog/ by scripts/generate.mjs. Do not edit by hand. -->
# Changelog

Commit-log changelog — bronze nodes on a 1px trunk, dates in the gutter. The content's real structure (a history) becomes the visual structure.

```jsx
import { Changelog } from "../../components/Changelog/Changelog.jsx";
```

## Props — `ChangelogProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `entries` | `ChangelogEntry[]` | yes |  |

## Props — `ChangelogEntry`

| prop | type | required | description |
|------|------|----------|-------------|
| `date` | `string` | yes | ISO-ish date shown in the left gutter, e.g. "2026-07-08" |
| `what` | `React.ReactNode` | yes | What changed — a sentence, may contain links |
| `ref` | `string` |  | Mono footnote, e.g. "writing · 2,400 words" |

## See also

- Specimen: [`components/Changelog/card.html`](../../components/Changelog/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

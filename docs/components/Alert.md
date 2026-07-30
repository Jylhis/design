<!-- GENERATED from components/Alert/ by scripts/generate.mjs. Do not edit by hand. -->
# Alert

Status alert — 3px left border, mono uppercase head with glyph, serif body.

```jsx
import { Alert } from "../../components/Alert/Alert.jsx";
```

## Props — `AlertProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `kind` | `"info" \| "ok" \| "warn" \| "err"` |  | Status kind — each pairs a color with a glyph, so color is never the only signal |
| `title` | `string` |  | Head label; defaults to info/success/warning/error |
| `children` | `React.ReactNode` |  |  |

## Accessibility

- Per docs/ACCESSIBILITY.md: role="alert" only for blocking errors; other
- kinds announce politely via aria-live instead of a status role.

## See also

- Specimen: [`components/Alert/card.html`](../../components/Alert/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

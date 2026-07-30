<!-- GENERATED from components/Field/ by scripts/generate.mjs. Do not edit by hand. -->
# Field

Labeled form field — mono label, 1px border input, bronze focus ring.

```jsx
import { Field } from "../../components/Field/Field.jsx";
```

## Props — `FieldProps`

Extends `React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>`.

| prop | type | required | description |
|------|------|----------|-------------|
| `label` | `string` | yes | Lowercase mono label above the input |
| `help` | `string` |  | Muted helper line under the input — linked to the input via aria-describedby |
| `error` | `string` |  | Error message — replaces help, colors it status-err, sets aria-invalid, and is linked via aria-describedby |
| `textarea` | `boolean` |  | Render a textarea instead of an input |

## Accessibility

- aria-describedby links the help/error text to the input so screen
- readers announce it — aria-invalid alone only says "invalid".

## See also

- Specimen: [`components/Field/card.html`](../../components/Field/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

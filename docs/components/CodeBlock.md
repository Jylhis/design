<!-- GENERATED from components/CodeBlock/ by scripts/generate.mjs. Do not edit by hand. -->
# CodeBlock

Fenced code block with optional filename tab. Syntax colors come from Modus tokens, never the copper accent.

```jsx
import { CodeBlock } from "../../components/CodeBlock/CodeBlock.jsx";
```

## Props — `CodeBlockProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `filename` | `string` |  | File tab above the block, e.g. "config/devenv.nix" |
| `children` | `React.ReactNode` |  | Code content — plain text, or spans colored with the --color-syntax-* tokens (Modus palette) |

## See also

- Specimen: [`components/CodeBlock/card.html`](../../components/CodeBlock/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

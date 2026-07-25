<!-- GENERATED from components/Terminal/ by scripts/generate.mjs. Do not edit by hand. -->
# Terminal

Terminal session frame — the codeblock idiom with a title bar and prompt lines. The prompt chevron is always the bronze accent (ANSI 11 rule); output colors come from Modus/status tokens, never the accent.

```jsx
import { Terminal } from "../../components/Terminal/Terminal.jsx";
```

## Props — `TerminalProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `title` | `string` |  | Title bar text, e.g. "user@host — zsh". Omit for a bare frame. |
| `caret` | `boolean` |  | Show a blinking bronze caret on a trailing empty prompt line |
| `children` | `React.ReactNode` |  | TerminalLine elements, or any pre-styled mono content |

## Props — `TerminalLineProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `cmd` | `string` |  | The command as typed after the ❯ prompt |
| `cwd` | `string` |  | Optional prompt context before the chevron, e.g. "~/code/jylhis" |
| `children` | `React.ReactNode` |  | Output block below the command — plain text or spans colored with --color-syntax-* / --color-status-* tokens |

## See also

- Specimen: [`components/Terminal/card.html`](../../components/Terminal/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

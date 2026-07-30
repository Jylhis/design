<!-- GENERATED from components/Tabs/ by scripts/generate.mjs. Do not edit by hand. -->
# Tabs

ARIA tablist with roving tabindex (arrows + Home/End, focus follows selection). The one component that carries state: uncontrolled by default, controllable via value/onChange — the sole, scoped exception to the otherwise-stateless library.

```jsx
import { Tabs } from "../../components/Tabs/Tabs.jsx";
```

## Anatomy

- folder · roving tabindex · arrows move
- rail · accent underline

## Props — `TabsProps`

Extends `Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">`.

| prop | type | required | description |
|------|------|----------|-------------|
| `tabs` | `TabItem[]` |  | tab definitions, in display order |
| `defaultValue` | `string` |  | initial active tab id (uncontrolled); defaults to the first tab |
| `value` | `string` |  | active tab id (controlled) — pass with onChange to own the state |
| `onChange` | `(id: string) => void` |  | fires with the newly selected tab id on click or arrow-key move |
| `variant` | `"folder" \| "rail"` |  | folder = boxed tabs; rail = accent-underline (no folder chrome) |

## Props — `TabItem`

| prop | type | required | description |
|------|------|----------|-------------|
| `id` | `string` | yes | stable id, used for selection and to wire tab↔panel aria |
| `label` | `React.ReactNode` | yes | tab button label |
| `panel` | `React.ReactNode` | yes | panel content shown when this tab is active |

## Accessibility

- Roving tabindex per platforms/KEYBOARD.md — arrows move + activate, focus
- follows selection (automatic-activation tablist, WAI-APG).

## See also

- Specimen: [`components/Tabs/card.html`](../../components/Tabs/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

<!-- GENERATED from components/Modal/ by scripts/generate.mjs. Do not edit by hand. -->
# Modal

Modal dialog on the native <dialog> element — focus trap, ESC, and inert backdrop come from the platform, not a dependency. Flat: raised surface + hairline, scrim backdrop, no shadow.

```jsx
import { Modal } from "../../components/Modal/Modal.jsx";
```

## Anatomy

- native <dialog> · focus trap + ESC · scrim backdrop

## Props — `ModalProps`

Extends `Omit<React.DialogHTMLAttributes<HTMLDialogElement>, "title">`.

| prop | type | required | description |
|------|------|----------|-------------|
| `open` | `boolean` | yes | controlled visibility — true calls the native dialog.showModal() |
| `onClose` | `() => void` |  | fires on ESC, the close button, or backdrop dismissal (parent sets open=false) |
| `title` | `React.ReactNode` | yes | dialog title; wired as the accessible name via aria-labelledby |
| `actions` | `React.ReactNode` |  | footer actions (buttons), right-aligned; omit for a message-only dialog |
| `children` | `React.ReactNode` |  |  |

## Accessibility

- Sync the `open` prop to the native <dialog>. showModal() gives us the
- focus trap, ESC handling, and inert backdrop for free — no library.
- The native 'close' event fires for ESC, the close button, and backdrop

## See also

- Specimen: [`components/Modal/card.html`](../../components/Modal/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

# Keyboard & Accessibility Primitives

Applies equally to web, Emacs, rofi/wofi, any native app we theme. The **selected** and **focus** visual languages are identical across targets — you can spot a Jylhis-themed surface by the accent left-border on selected items.

---

## Focus ring

Rule: every focusable element has a visible focus state. Never `outline: none`.

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 2px;
}
```

- **2px minimum** stroke.
- **2px offset** so the ring is never flush against the element.
- **AAA contrast** — `accent` is 5.1:1 on light, 7.9:1 on dark (both meet non-text AAA at ≥ 3:1, and our ring is treated as informational text-adjacent).
- **Offset respects border-radius:** ring inherits + adds 2px.

TUI equivalent (Emacs, rofi): inverse video with accent bg. `(:background accent :foreground bg)`.

## Kbd / shortcut chips

Rule: any keyboard shortcut mentioned in the UI is wrapped in `<kbd>` (or equivalent) with consistent styling.

```css
kbd {
  font-family: var(--font-mono);
  font-size: 0.72em;
  padding: 0.15em 0.4em;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-strong);
  border-radius: 3px;
  color: var(--color-text-muted);
  box-shadow: 0 1px 0 var(--color-border-strong);
}
```

Separator between keys: thin space `+ ` (space-plus-space), never stylized (`⌘` stays as the glyph).

In TUI / Emacs: `[C-x b]` style with literal brackets. Rofi: kbd hints right-aligned in muted color.

## Leader key cheatsheet

Rule: after a leader key is held (default: `<leader>` is `SPC` in Emacs, `Super` in Hyprland, `Cmd+K` on web), a bottom-anchored popover shows the submenu tree.

Visual:
- Paper bg (`surface-raised`), accent left-border (3px), `1rem` padding.
- Grid of `key` → `command description`.
- Key in `accent` + mono + bold. Description in body text + muted.
- Escape closes. The ESC hint lives top-right of the popover.
- 250ms slide-up + fade. Reduce-motion: instant.

## Command palette (cross-platform)

One visual language for web (Cmd+K / `/`), Emacs `M-x` + Vertico + Consult, rofi run/drun.

Structure (top to bottom):
1. **Prompt line.** `> _` where `>` is `accent`, input is `text`, placeholder is `text-faint`.
2. **Filter hints row.** `type a filter · tab to cycle · esc to close` in mono `text-muted` 0.72rem.
3. **Results list.** Each row: `[icon] [label]  [hint/kbd right-aligned]`.
4. **Selected row.** `accent-subtle` bg + `accent` 3px left-border. No checkmark, no bold.

Modal shell:
- 560px max width, centered, 15vh from top.
- Backdrop: `rgba(0,0,0,0.35)` in light, `rgba(0,0,0,0.55)` in dark. Click to dismiss.
- Enter activates. Tab cycles filters. ESC dismisses.
- No animation on open/close except opacity (0 → 1 in 150ms). Keyboard-first = no decorative motion.

## Selected item (universal)

Any list with keyboard navigation (menus, file lists, Vertico, rofi, tag pickers, message lists, buffer lists) uses the same selected-row language:

```
bg: color-accent-subtle
border-left: 3px solid color-accent
```

Nothing else changes between selected/unselected — no bold, no indent, no color shift on labels (so diffing is instant).

In TUI where borders aren't available: inverse video.

## Dismiss / ESC hint

Rule: if a modal, popover, overlay, or palette is open, the label `ESC` is visible in mono `text-muted` 0.72rem, top-right of the modal. Always. Never behind a question mark or hover.

Format: `esc to close` or just `esc` when space is tight.

## Tab order

1. Visible-first: a focused element outside the viewport must trigger scroll-to.
2. Skip links (web): "Skip to content" is the first focusable element on every page. Hidden visually until focused, then rendered as a top-left kbd chip.
3. Modals trap focus. Tabbing out wraps. ESC returns focus to the trigger.

## Shortcuts — canonical bindings

Where a platform permits, use the same shortcut for the same concept:

| Action | Web | Emacs | Hyprland | Rofi |
|---|---|---|---|---|
| Open command palette | `Cmd/Ctrl K` | `M-x` | `Super d` | (self) |
| Search current view | `/` | `C-s` | n/a | type |
| Cancel / close | `Esc` | `C-g` | `Esc` | `Esc` |
| Next / prev item | `↓ ↑` / `Tab` | `C-n C-p` | `Tab` | `↓ ↑` |
| Toggle theme | `Cmd/Ctrl Shift L` | `M-x jylhis-toggle-theme` | `Super Shift T` | — |

---

## Audit checklist

Before shipping any surface, verify:
- [ ] Every focusable element has a visible focus ring at 2px.
- [ ] Every shortcut mentioned is in a kbd element (or equivalent).
- [ ] No action is mouse-only.
- [ ] ESC dismisses every transient overlay and that's documented on-screen.
- [ ] Selected row uses the shared language (accent-subtle bg + accent left-border, OR inverse video in TUI).
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Colors verified against `tokens.md` §1 (ratios inlined beside each token).

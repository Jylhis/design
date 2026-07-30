# Voice & microcopy

How the system *sounds*. Copy is a design token: the surveyor register collapses if the words read like a SaaS landing page. Five rules, no exceptions without a PR.

---

## 1. First person singular

This is one person's work and it says so. "I read everything", never "we're thrilled". No royal we, no brand-as-person.

## 2. Buttons are commands, lowercase

A button does what a shell command does: names the action, nothing else. `say hello ›`, `read more ›`, `copy`. Never "Get In Touch Today!", never Title Case, never a verb dressed as an invitation.

## 3. Errors use errno style

State the code, the fact, and the pointer — in that order. Calm, technical, useful.

> `E404: no such page — see index(1)`

Never apologize theatrically ("Oops!"), never blame the user, never hide the pointer.

## 4. Empty states are comments

An empty state is annotated absence, in the system's own `//` voice. It may be wry; it may not be cute.

> `// nothing here yet — drafts live longer than they should`

## 5. No exclamation marks, no marketing adjectives

No "amazing", "powerful", "seamless", "delightful". If the work is good, plain description carries it. The one permitted `!` is in code samples where the language requires it.

---

## Reference pairs

| Context | Generic | Jylhis |
|---|---|---|
| CTA button | Get In Touch Today! | `say hello ›` |
| 404 page | Oops! We couldn't find that page. | `E404: no such page — see index(1)` |
| Empty state | Nothing here yet. Check back soon! | `// nothing here yet — drafts live longer than they should` |
| Loading | Loading, please wait… | `fetching` + caret (see motion.css) |
| Form success | Thank you! Your message has been sent successfully. | `✓ sent — I read everything, reply within a week` |

Status lines keep the glyph + word pairing from [`ACCESSIBILITY.md`](ACCESSIBILITY.md) — the glyph never carries meaning alone.

## Casing

Follows [`STYLE-GUIDE.md`](STYLE-GUIDE.md) §2: lowercase chrome, sentence-case prose, UPPERCASE(7) man-page labels, canonical for code and proper nouns.

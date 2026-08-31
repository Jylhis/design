<!-- GENERATED from components/Breadcrumb/ by scripts/generate.mjs. Do not edit by hand. -->
# Breadcrumb

Path-style breadcrumb — mono, "›" separators, accent links, muted current page.

```jsx
import { Breadcrumb } from "../../components/Breadcrumb/Breadcrumb.jsx";
```

## Props — `BreadcrumbProps`

| prop | type | required | description |
|------|------|----------|-------------|
| `items` | `BreadcrumbItem[]` |  |  |
| `onNavigate` | `(href: string, item: BreadcrumbItem, e: React.MouseEvent) => void` |  | SPA navigation hook — called instead of following the link |

## Props — `BreadcrumbItem`

| prop | type | required | description |
|------|------|----------|-------------|
| `label` | `string` | yes |  |
| `href` | `string` |  | Omit on the current page (the last item never links) |

## See also

- Specimen: [`components/Breadcrumb/card.html`](../../components/Breadcrumb/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)

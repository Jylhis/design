// primitives.jsx — pulls shared components straight from the design system
// (the component JSX files loaded in index.html populate window.exports).
// Nothing is reimplemented here; edit components/<Name>/<Name>.jsx in the
// design system instead.

const {
  Tag, TagList, StatusBadge, CodeBlock, CvEntry,
  Callout, Breadcrumb, Button, Kbd, Divider, ManLabel, Mark,
} = window.exports;

// Page-local helper (formatting, not a design-system concern)
const FormattedDate = ({ date }) => {
  const d = new Date(date);
  const fmt = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  return <time dateTime={d.toISOString()}>{fmt}</time>;
};

Object.assign(window, {
  Tag, TagList, StatusBadge, CodeBlock, CvEntry,
  Callout, Breadcrumb, Button, Kbd, Divider, ManLabel, Mark,
  FormattedDate,
});

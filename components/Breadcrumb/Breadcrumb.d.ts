import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the current page (the last item never links) */
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  /** SPA navigation hook — called instead of following the link */
  onNavigate?: (href: string, item: BreadcrumbItem, e: React.MouseEvent) => void;
}

/** Path-style breadcrumb — mono, "›" separators, accent links, muted current page. */
export declare function Breadcrumb(props: BreadcrumbProps): React.JSX.Element;

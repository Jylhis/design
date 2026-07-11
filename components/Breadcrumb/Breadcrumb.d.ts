import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the current page (the last item never links) */
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

/** Path-style breadcrumb — mono, "›" separators, accent links, muted current page. */
export declare function Breadcrumb(props: BreadcrumbProps): React.JSX.Element;

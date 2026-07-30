import * as React from "react";

export interface TabItem {
  /** stable id, used for selection and to wire tab↔panel aria */
  id: string;
  /** tab button label */
  label: React.ReactNode;
  /** panel content shown when this tab is active */
  panel: React.ReactNode;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** tab definitions, in display order */
  tabs?: TabItem[];
  /** initial active tab id (uncontrolled); defaults to the first tab */
  defaultValue?: string;
  /** active tab id (controlled) — pass with onChange to own the state */
  value?: string;
  /** fires with the newly selected tab id on click or arrow-key move */
  onChange?: (id: string) => void;
  /** folder = boxed tabs; rail = accent-underline (no folder chrome) */
  variant?: "folder" | "rail";
}

/**
 * ARIA tablist with roving tabindex (arrows + Home/End, focus follows
 * selection). The one component that carries state: uncontrolled by default,
 * controllable via value/onChange — the sole, scoped exception to the
 * otherwise-stateless library.
 */
export declare function Tabs(props: TabsProps): React.JSX.Element;

import type { SelectionState, SelectionStep } from "./types";
import { serializeSelectionParams } from "./urlState";

export function selectionHomeHref(
  state?: SelectionState,
  step?: SelectionStep,
): string {
  const params = state ? serializeSelectionParams(state) : new URLSearchParams();
  if (step) params.set("step", step);
  const query = params.toString();
  return query ? `/?${query}#solutions` : "/#solutions";
}

/** `search` = query string without leading `?` (as from `URLSearchParams.toString()`). */
export function selectionLegacyToHomePath(search: string): string {
  const query = search.replace(/^\?/, "");
  return query ? `/?${query}#solutions` : "/#solutions";
}

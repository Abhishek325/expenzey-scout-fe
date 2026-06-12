import { ref } from "vue";

/** Bumped when the active string map changes so keyed views can remount with new copy. */
export const localeRevision = ref(0);

export function bumpLocaleRevision(): void {
  localeRevision.value += 1;
}

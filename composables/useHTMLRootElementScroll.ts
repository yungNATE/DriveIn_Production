import { watchEffect, unref, onBeforeUnmount } from "vue";

export function useHTMLRootElementScroll(source) {
  if (typeof window === "undefined") return;

  const el = document.documentElement;
  const property = "overflow";
  const value = "hidden";

  const stop = watchEffect(() => {
    unref(source)
      ? el.style.setProperty(property, value)
      : el.style.removeProperty(property);
  });

  onBeforeUnmount(() => {
    if (stop) stop();
    el.style.removeProperty(property);
  });
}

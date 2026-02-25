import { watchEffect, unref, onBeforeUnmount, type Ref } from "vue";

export function useHTMLRootElementScroll(
  source: boolean | Ref<boolean> | null | undefined,
) {
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

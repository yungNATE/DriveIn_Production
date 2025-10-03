import { ref } from "vue";

// Global reactive flag controlling header visibility
const isHeaderHidden = ref(false);

export function useHeaderVisibility() {
  return { isHeaderHidden };
}

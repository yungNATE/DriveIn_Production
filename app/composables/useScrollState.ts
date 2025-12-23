import { ref, onMounted, onBeforeUnmount } from "vue";

const isScrolled = ref(false);
const y = ref(0);

function update() {
  y.value = window.scrollY || window.pageYOffset;
  isScrolled.value = y.value > 0;
}

export function useScrollState() {
  onMounted(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", update);
  });
  return { isScrolled, y };
}

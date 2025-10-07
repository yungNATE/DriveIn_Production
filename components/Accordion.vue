<script setup lang="ts">
/**
 * Simple accessible accordion component.
 * Props:
 *  - accordionPanels: Array of panels { header: string; content?: string; customHtml?: string; open?: boolean }
 *  - onlyOnOpenAtTheTime: boolean (if true, only one panel can be open at a time)
 *
 * Emits:
 *  - update:openPanels (number[]) => indices of panels currently open (potential future v-model extension)
 *  - toggle (panelIndex: number, isOpen: boolean)
 */

import {
  ref,
  watch,
  computed,
  onMounted,
  nextTick,
  type ComponentPublicInstance,
} from "vue";

export interface AccordionPanel {
  header: string;
  content?: string; // Plain text paragraph
  customHtml?: string; // Raw HTML (trusted content). If untrusted, sanitize before passing.
  open?: boolean; // Initial open state
}

const props = defineProps<{
  accordionPanels: AccordionPanel[];
  onlyOnOpenAtTheTime?: boolean;
  /**
   * Max width of the accordion container. Accepts any CSS size value (e.g. '800px', '60ch', '50%', 'min(100%,900px)').
   * If a number is provided, it's treated as pixels.
   */
  maxWidth?: string | number;
}>();

const emit = defineEmits<{
  (e: "toggle", index: number, isOpen: boolean): void;
  (e: "update:openPanels", openPanels: number[]): void;
}>();

// Create a local reactive copy to manage open state without mutating prop array directly.
const internalPanels = ref(
  props.accordionPanels.map((p) => ({ ...p, isOpen: !!p.open }))
);

watch(
  () => props.accordionPanels,
  (newVal) => {
    // If array reference changes, sync (keep current open states when possible by header match)
    const openStateByHeader = new Map(
      internalPanels.value.map((p) => [p.header, p.isOpen])
    );
    internalPanels.value = newVal.map((p) => ({
      ...p,
      isOpen: openStateByHeader.get(p.header) ?? !!p.open,
    }));
  },
  { deep: true }
);

const openPanelsIndexes = computed(() =>
  internalPanels.value.reduce<number[]>((acc, p, idx) => {
    if (p.isOpen) acc.push(idx);
    return acc;
  }, [])
);

const resolvedMaxWidth = computed(() =>
  typeof props.maxWidth === "number"
    ? `${props.maxWidth}px`
    : props.maxWidth || "100%"
);

watch(openPanelsIndexes, (val) => emit("update:openPanels", val));

// Refs to wrapper elements for manual animation (no display:none usage)
const bodyWrappers = ref<HTMLElement[]>([]);
function setBodyWrapper(
  el: Element | ComponentPublicInstance | null,
  index: number
) {
  if (!el) return;
  // If it's a component instance, attempt to resolve its root element
  const resolved = (el as ComponentPublicInstance).$el
    ? (el as ComponentPublicInstance).$el
    : el;
  if (resolved instanceof HTMLElement) bodyWrappers.value[index] = resolved;
}

function animateOpen(el: HTMLElement) {
  el.dataset.animating = "true";
  el.style.overflow = "hidden";
  // Start closed state (if not already)
  const startHeight = el.offsetHeight; // may be 0
  const target = el.scrollHeight;
  el.style.height = startHeight + "px";
  el.style.opacity =
    getComputedStyle(el).opacity === "0" ? "0" : el.style.opacity || "0";
  requestAnimationFrame(() => {
    el.style.transition =
      "height 0.45s cubic-bezier(.35,.6,.25,1), opacity 0.35s ease";
    el.style.height = target + "px";
    el.style.opacity = "1";
    const handler = (e: TransitionEvent) => {
      if (e.propertyName === "height") {
        el.style.height = "auto";
        el.style.overflow = "visible";
        el.dataset.animating = "false";
        el.removeEventListener("transitionend", handler);
      }
    };
    el.addEventListener("transitionend", handler);
  });
}

function animateClose(el: HTMLElement) {
  el.dataset.animating = "true";
  el.style.overflow = "hidden";
  const current = el.scrollHeight; // current full height
  el.style.height = current + "px"; // set explicit height to allow transition to 0
  requestAnimationFrame(() => {
    el.style.transition =
      "height 0.4s cubic-bezier(.6,.05,.4,1), opacity 0.3s ease";
    el.style.height = "0px";
    el.style.opacity = "0";
    const handler = (e: TransitionEvent) => {
      if (e.propertyName === "height") {
        el.dataset.animating = "false";
        el.removeEventListener("transitionend", handler);
      }
    };
    el.addEventListener("transitionend", handler);
  });
}

function toggle(index: number) {
  const previous = internalPanels.value.map((p) => p.isOpen);
  internalPanels.value = internalPanels.value.map((p, i) => {
    if (i !== index) {
      if (props.onlyOnOpenAtTheTime) return { ...p, isOpen: false };
      return p;
    }
    const willOpen = !p.isOpen;
    emit("toggle", i, willOpen);
    return { ...p, isOpen: willOpen };
  });
  nextTick(() => {
    internalPanels.value.forEach((p, i) => {
      if (!bodyWrappers.value[i]) return;
      if (previous[i] !== p.isOpen) {
        p.isOpen
          ? animateOpen(bodyWrappers.value[i])
          : animateClose(bodyWrappers.value[i]);
      }
    });
  });
}

onMounted(() => {
  // Initialize heights without flashes
  bodyWrappers.value.forEach((el, i) => {
    const isOpen = internalPanels.value[i]?.isOpen;
    el.style.transition = "none";
    if (isOpen) {
      el.style.height = "auto";
      el.style.opacity = "1";
      el.style.overflow = "visible";
    } else {
      el.style.height = "0px";
      el.style.opacity = "0";
      el.style.overflow = "hidden";
    }
    // Force reflow then allow transitions
    void el.offsetHeight;
    el.style.transition = "";
  });
});
</script>

<template>
  <div
    class="accordion"
    :class="{ 'single-open': onlyOnOpenAtTheTime }"
    :style="{ maxWidth: resolvedMaxWidth, width: '100%' }"
  >
    <div
      v-for="(panel, i) in internalPanels"
      :key="panel.header + i"
      class="accordion-panel"
      :class="{ open: panel.isOpen }"
    >
      <button
        class="accordion-header"
        type="button"
        :aria-expanded="panel.isOpen ? 'true' : 'false'"
        :aria-controls="'acc-panel-' + i"
        @click="toggle(i)"
      >
        <span class="header-text">{{ panel.header }}</span>
        <span class="arrow" aria-hidden="true">
          <slot name="arrow">
            <!-- Default arrow icon -->
            <svg
              class="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </slot>
        </span>
      </button>
      <div
        class="accordion-body-wrapper"
        :ref="(el) => setBodyWrapper(el, i)"
        :data-open="panel.isOpen ? 'true' : 'false'"
        role="region"
        :id="'acc-panel-' + i"
        :aria-labelledby="'acc-header-' + i"
      >
        <div class="accordion-body">
          <p v-if="panel.content" class="paragraph">{{ panel.content }}</p>
          <div
            v-if="panel.customHtml"
            class="custom-html"
            v-html="panel.customHtml"
          />
          <slot name="panel" :panel="panel" :index="i" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.accordion-panel {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
  position: relative;
  overflow: hidden;

  // Subtle gradient sheen for hover (fading in)
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 15% 15%,
      rgba(255, 255, 255, 0.09),
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover:not(.open) {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.05);
  }

  &.open {
    border-color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.08);
  }
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  font: inherit;
  font-weight: 600;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  position: relative;
  transition: color 0.35s ease;

  // Animated underline reveal
  &::after {
    content: "";
    position: absolute;
    left: 1.25rem;
    right: 2.5rem; // leave space for arrow
    bottom: 0.55rem;
    height: 2px;
    background: linear-gradient(
      90deg,
      #d1b464 0%,
      rgba(209, 180, 100, 0.2) 100%
    );
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.45s cubic-bezier(0.65, 0.05, 0.36, 1);
    pointer-events: none;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:hover {
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
  will-change: transform;
}

.accordion-panel.open .arrow {
  transform: rotate(180deg);
}
.accordion-panel:not(.open):hover .arrow {
  transform: translateY(-2px);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.accordion-body {
  padding: 0 1.25rem 1.2rem 1.25rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: inherit;
}

.paragraph {
  margin: 0.5rem 0 0.75rem;
}

.custom-html :deep(a) {
  color: #d1b464;
}
</style>

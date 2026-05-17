<script setup lang="ts">
/**
 * Simple accessible accordion component.
 * Props:
 *  - accordionPanels: Array of panels { header: string; content?: string; customHtml?: string; open?: boolean }
 *  - onlyOneOpenAtTheTime: boolean (if true, only one panel can be open at a time)
 *  - openFirstPanel: boolean (default true). If no panel has explicit `open: true`, the first panel starts open.
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

const props = withDefaults(
  defineProps<{
    accordionPanels: AccordionPanel[];
    onlyOneOpenAtTheTime?: boolean;
    /**
     * Max width of the accordion container. Accepts any CSS size value (e.g. '800px', '60ch', '50%', 'min(100%,900px)').
     * If a number is provided, it's treated as pixels.
     */
    maxWidth?: string | number;
    /**
     * If true, opens the first panel by default (unless an explicit `open: true` exists on any panel).
     */
    openFirstPanel?: boolean;
  }>(),
  {
    openFirstPanel: true,
  },
);

const emit = defineEmits<{
  (e: "toggle", index: number, isOpen: boolean): void;
  (e: "update:openPanels", openPanels: number[]): void;
}>();

// Create a local reactive copy to manage open state without mutating prop array directly.
const internalPanels = ref(
  (() => {
    const anyExplicitOpen = props.accordionPanels.some((p) => !!p.open);
    return props.accordionPanels.map((p, idx) => ({
      ...p,
      isOpen:
        !!p.open || (!anyExplicitOpen && props.openFirstPanel && idx === 0),
    }));
  })(),
);

watch(
  () => props.accordionPanels,
  (newVal) => {
    // Preserve previous state to animate diffs
    const previous = internalPanels.value.map((p) => p.isOpen);

    // Keep current open states when possible by header match,
    // but honor explicit `open` values if they are provided by the parent
    const openStateByHeader = new Map(
      internalPanels.value.map((p) => [p.header, p.isOpen]),
    );
    const anyExplicitOpen = newVal.some((p) => typeof p.open === "boolean");

    internalPanels.value = newVal.map((p, idx) => {
      const explicit = typeof p.open === "boolean" ? p.open : undefined;
      const defaultFirst =
        !anyExplicitOpen && props.openFirstPanel && idx === 0;
      return {
        ...p,
        isOpen: explicit ?? openStateByHeader.get(p.header) ?? defaultFirst,
      };
    });

    nextTick(() => {
      internalPanels.value.forEach((p, i) => {
        const el = bodyWrappers.value[i];
        if (!el) return;
        if (previous[i] !== p.isOpen) {
          p.isOpen ? animateOpen(el) : animateClose(el);
        }
      });
    });
  },
  { deep: true },
);

// If consumer toggles the prop on and no panels are open, open the first one
watch(
  () => props.openFirstPanel,
  (val) => {
    if (!val) return;
    const anyOpen = internalPanels.value.some((p) => p.isOpen);
    if (!anyOpen && internalPanels.value.length) {
      internalPanels.value = internalPanels.value.map((p, idx) => ({
        ...p,
        isOpen: idx === 0,
      }));
    }
  },
);

const openPanelsIndexes = computed(() =>
  internalPanels.value.reduce<number[]>((acc, p, idx) => {
    if (p.isOpen) acc.push(idx);
    return acc;
  }, []),
);

const resolvedMaxWidth = computed(() =>
  typeof props.maxWidth === "number"
    ? `${props.maxWidth}px`
    : props.maxWidth || "100%",
);

watch(openPanelsIndexes, (val) => emit("update:openPanels", val));

// Refs to wrapper elements for manual animation (no display:none usage)
const bodyWrappers = ref<HTMLElement[]>([]);
// Track transitionend handlers to safely cancel/replace on rapid toggles
const transitionHandlers = new WeakMap<
  HTMLElement,
  (e: TransitionEvent) => void
>();

function clearPreviousTransition(el: HTMLElement) {
  const prev = transitionHandlers.get(el);
  if (prev) {
    el.removeEventListener("transitionend", prev);
    transitionHandlers.delete(el);
  }
  // Do not reset styles here; caller sets appropriate starting styles
}

function setBodyWrapper(
  el: Element | ComponentPublicInstance | null,
  index: number,
) {
  if (!el) return;
  // If it's a component instance, attempt to resolve its root element
  const resolved = (el as ComponentPublicInstance).$el
    ? (el as ComponentPublicInstance).$el
    : el;
  if (resolved instanceof HTMLElement) bodyWrappers.value[index] = resolved;
}

function animateOpen(el: HTMLElement) {
  clearPreviousTransition(el);
  el.dataset.animating = "true";
  el.dataset.transitionKind = "open"; // mark kind to discriminate stale fallbacks
  el.style.overflow = "hidden";
  el.style.pointerEvents = "none"; // prevent interaction during animation

  // Establish current height as start value (even if mid-transition)
  const computed = getComputedStyle(el);
  const current = el.getBoundingClientRect().height; // may be 0 when closed
  const target = el.scrollHeight;
  el.style.transition = "none";
  // If current equals target (e.g., previously auto), force start at 0 to ensure visible animation
  const startHeight = Math.abs(current - target) < 1 ? 0 : current;
  el.style.height = startHeight + "px";
  el.style.opacity = computed.opacity || "0";
  // Force reflow before transitioning to target height
  void el.offsetHeight;

  requestAnimationFrame(() => {
    el.style.transition =
      "height 0.45s cubic-bezier(.35,.6,.25,1), opacity 0.35s ease";
    el.style.height = target + "px";
    el.style.opacity = "1";
    const handler = (e: TransitionEvent) => {
      if (e.propertyName !== "height") return;
      el.style.height = "auto";
      el.style.overflow = "visible";
      el.style.pointerEvents = "auto";
      el.dataset.animating = "false";
      delete el.dataset.transitionKind;
      el.removeEventListener("transitionend", handler);
      transitionHandlers.delete(el);
    };
    transitionHandlers.set(el, handler);
    el.addEventListener("transitionend", handler);

    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
      // Guard against race: ensure it's still the same transition kind
      if (
        el.dataset.animating === "true" &&
        el.dataset.transitionKind === "open"
      ) {
        handler(
          new TransitionEvent("transitionend", { propertyName: "height" }),
        );
      }
    }, 650);
  });
}

function animateClose(el: HTMLElement) {
  clearPreviousTransition(el);
  el.dataset.animating = "true";
  el.dataset.transitionKind = "close"; // mark kind for fallback discrimination
  el.style.overflow = "hidden";
  el.style.pointerEvents = "none";

  const currentHeight = el.getBoundingClientRect().height || el.scrollHeight;
  el.style.transition = "none";
  el.style.height = currentHeight + "px"; // explicit height to allow transition to 0
  // Force reflow
  void el.offsetHeight;
  requestAnimationFrame(() => {
    el.style.transition =
      "height 0.4s cubic-bezier(.6,.05,.4,1), opacity 0.3s ease";
    el.style.height = "0px";
    el.style.opacity = "0";
    const handler = (e: TransitionEvent) => {
      if (e.propertyName !== "height") return;
      el.dataset.animating = "false";
      delete el.dataset.transitionKind;
      el.removeEventListener("transitionend", handler);
      transitionHandlers.delete(el);
    };
    transitionHandlers.set(el, handler);
    el.addEventListener("transitionend", handler);

    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
      if (
        el.dataset.animating === "true" &&
        el.dataset.transitionKind === "close"
      ) {
        handler(
          new TransitionEvent("transitionend", { propertyName: "height" }),
        );
      }
    }, 550);
  });
}

function toggle(index: number) {
  const previous = internalPanels.value.map((p) => p.isOpen);
  internalPanels.value = internalPanels.value.map((p, i) => {
    if (i !== index) {
      if (props.onlyOneOpenAtTheTime) return { ...p, isOpen: false };
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
      el.style.pointerEvents = "auto";
    } else {
      el.style.height = "0px";
      el.style.opacity = "0";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
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
    :class="{ 'single-open': onlyOneOpenAtTheTime }"
    :style="{ maxWidth: resolvedMaxWidth, width: '100%' }"
  >
    <div
      v-for="(panel, i) in internalPanels"
      :key="panel.header + i"
      class="accordion-panel"
      :class="{ open: panel.isOpen }"
    >
      <Button
        class="accordion-header"
        type="button"
        :aria-expanded="panel.isOpen ? 'true' : 'false'"
        :aria-controls="'acc-panel-' + i"
        :title="panel.header"
        :disableArrow="true"
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
      </Button>
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
  border-radius: 8px;
  background: black;
  backdrop-filter: blur(4px);
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    0.3s filter;
  position: relative;

  * &:hover:not(.open),
  &.open {
    .header-text {
      color: $primary-color-light;
    }
  }
}

.accordion-header {
  width: 100%;
  text-align: left;
  padding: 1rem 1.25rem;

  :deep(.header-text) {
    width: auto;
  }

  :deep(.content) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

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
      rgba(white, 0.5) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    width: 0;
    transition: width 0.45s cubic-bezier(0.65, 0.05, 0.36, 1);
    pointer-events: none;
  }

  &:hover::after {
    width: 80%;
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
  padding: 1rem 1.25rem 1.2rem 1.25rem;
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

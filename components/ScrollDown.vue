<script setup>
const props = defineProps({
  to: {
    type: [String],
    required: true,
  },
});

// On click, smooth scroll to the anchor
const anchor = computed(() => `#${props.to}`);

// Offset (header height + margin) pour éviter l'overlap
const OFFSET_PX = 200; // demandé: scroll à l'élément - 200px

function handleClick(event) {
  // Empêche le scroll natif de l'ancre pour appliquer l'offset
  event.preventDefault();

  if (import.meta.server) return; // sécurité SSR
  const id = props.to;
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.pageYOffset - OFFSET_PX;
  const clampedTop = Math.max(0, top); // Empêche le scroll négatif

  window.scrollTo({ top: clampedTop, behavior: "smooth" });
}
</script>

<template>
  <a
    class="scroll-down"
    style="scroll-behavior: smooth"
    aria-label="Scroll jusqu'au contenu de la page"
    :href="anchor"
    @click="handleClick"
  >
    <ArrowGlow></ArrowGlow>

    <p class="h3">
      <slot></slot>
    </p>
  </a>
</template>

<style lang="scss" scoped>
.scroll-down {
  display: flex;
  align-items: flex-end;
  gap: 3rem;
  cursor: pointer;
  color: var(--secondary-color-dark);
  text-decoration: none;
  width: fit-content;

  @include mediaquery("tablet") {
    display: none;
  }
  @include mediaquery("mobile") {
    display: none;
  }

  &:hover {
    :deep(.arrow-container::before) {
      opacity: 0.9;
    }

    :deep(img) {
      transform: translateY(5px);
    }
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
  }
}
</style>

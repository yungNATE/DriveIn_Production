<template>
  <div class="glowElement" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Ensure attributes (including class/style) passed to <GlowElement>
// are applied to the root element via $attrs (avoids duplication).
defineOptions({ inheritAttrs: false });
</script>

<style scoped>
/*
  Glow rules:
  - Default: gold glow
  - Hover: blue glow
  - With `.revert` class: default blue, hover gold
*/

.glowElement {
  /* Tunable variables (can be overridden from parent scope if needed) */
  --glow-gold: rgba(255, 218, 0, 0.5);
  --glow-blue: rgba(0, 106, 255, 0.5);
  --glow-color: var(--glow-gold);

  display: inline-block; /* keep the glow tight around its content */
  filter: drop-shadow(0 0 25px var(--glow-color));
  transition:
    filter 200ms ease,
    color 200ms ease;
}

.glowElement:hover {
  --glow-color: var(--glow-blue);
}

/* Revert: start blue, hover gold */
.glowElement.revert {
  --glow-color: var(--glow-blue);
}
.glowElement.revert:hover {
  --glow-color: var(--glow-gold);
}
</style>

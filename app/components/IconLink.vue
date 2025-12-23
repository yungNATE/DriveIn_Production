<script lang="ts" setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true }, // nom sans .svg
  alt: { type: String, default: "" },
  size: { type: String, default: "auto" },
  target: { type: String, default: "_blank" },
  rel: { type: String, default: "noopener" },
  classes: { type: String, default: "" },
});

const iconSvg = ref("");

onMounted(async () => {
  try {
    const svgFile = await import(`~/assets/icones/${props.icon}.svg?raw`);
    iconSvg.value = svgFile.default;
  } catch (e) {
    console.error(`SVG "${props.icon}" not found`, e);
  }
});
</script>

<template>
  <NuxtLink
    :to="to"
    :target="target"
    :rel="rel"
    :class="['icon-link', classes]"
    :aria-label="alt || icon"
    :title="alt || icon"
    :style="{ '--icon-size': size }"
    v-html="iconSvg"
  />
</template>

<style lang="scss" scoped>
.icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    display: block;
    width: var(--icon-size, auto);
    height: auto;
    transition:
      width 0.3s,
      height 0.3s;
  }

  &.glowing {
    &:hover :deep(svg) {
      opacity: 1;
      filter: drop-shadow(0 0 8px $primary-color-light);
    }

    :deep(svg) {
      fill: currentColor;
      transition:
        opacity 0.2s,
        filter 0.2s;
      opacity: 0.75;
    }
  }
}
</style>

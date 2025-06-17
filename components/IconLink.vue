<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true }, // nom sans .svg
  alt: { type: String, default: "" },
  size: { type: String, default: "" },
  target: { type: String, default: "_blank" },
  rel: { type: String, default: "noopener" },
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
    class="icon-link"
    :aria-label="alt || icon"
  >
    <span
      class="icon"
      v-html="iconSvg"
      :style="{ width: `${size}`, height: `auto` }"
    />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>

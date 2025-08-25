<template>
  <GlowElement v-bind="$attrs">
    <img :src="src" :alt="alt" class="img" />
  </GlowElement>
</template>

<script setup lang="ts">
// Props: image source and alt text
const props = defineProps<{
  src: string;
  alt: string;
}>();

// Forward attributes (e.g., class="revert", style, id) to GlowElement
defineOptions({ inheritAttrs: false });

// Destructure to avoid template warnings in strict setups
const { src, alt } = toRefs(props);
</script>

<style scoped>
.img {
  border-radius: 20px;
  display: block; /* avoid inline-gap */
}
</style>

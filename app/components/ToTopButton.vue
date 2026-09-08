<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "Retour en haut",
  },
);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <IconButton class="toTopButton" :title="title" @click="scrollToTop">
    <Arrow orientation="top" class="toTopButton__arrow" />
  </IconButton>
</template>

<style scoped lang="scss">
.toTopButton {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  padding: 12px;
}

.toTopButton__arrow {
  $size: 16px;
  width: $size;
  height: $size;
  transition: transform 0.2s ease;

  .toTopButton:hover & {
    transform: scale(1.3);
  }
}
</style>

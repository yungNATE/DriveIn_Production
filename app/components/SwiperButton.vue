<script setup lang="ts">
withDefaults(
  defineProps<{
    orientation?: "left" | "right";
    title: string;
  }>(),
  {
    orientation: "right",
  },
);
</script>

<template>
  <IconButton noHover class="swiperButton" :title="title">
    <Arrow :orientation="orientation" class="swiperButton__arrow" />
  </IconButton>
</template>

<style scoped lang="scss">
.swiperButton {
  &.swiperButton--hovered {
    transform: scale(0.9);
  }
}

.swiperButton__arrow {
  $size: 30px;
  width: $size;
  height: $size;
  transition: transform 0.2s ease;
  transform-origin: center;
  transition:
    fill 0.2s ease,
    transform 0.2s ease;

  .swiperButton:hover & {
    transform: scale(1.3);
  }
}
</style>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isHovered?: boolean;
    title: string;
  }>(),
  {
    isHovered: false,
  },
);
</script>

<template>
  <IconButton
    noHover
    :class="['playButton', { 'playButton--hovered': isHovered }]"
    :title="title"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="640"
      width="640"
      viewBox="0 0 640 640"
      class="playButton__arrowContainer"
    >
      <path
        class="playButton__arrow"
        d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
      />
    </svg>
  </IconButton>
</template>

<style scoped lang="scss">
.playButton {
  &.playButton--hovered {
    transform: scale(0.9);
  }
}

.playButton__arrowContainer {
  $size: 30px;
  width: $size;
  height: $size;
}

.playButton__arrow {
  transition: transform 0.2s ease;
  transform-origin: center;
  fill: rgba(255, 255, 255, 0.75);
  transition:
    fill 0.2s ease,
    transform 0.2s ease;

  .playButton--hovered & {
    transform: scale(1.3);
  }
}
</style>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isHovered?: boolean;
  }>(),
  {
    isHovered: false,
  },
);
</script>

<template>
  <Button
    title="Play"
    :disableArrow="true"
    :class="['playButton', { 'playButton--hovered': isHovered }]"
    ><svg
      height="48"
      width="68"
      viewBox="0 0 68 48"
      version="1.1"
      aria-hidden="true"
    >
      <path
        class="playButton__background"
        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
      />
      <path class="playButton__arrow" d="M 45,24 27,14 27,34" fill="#fff" />
    </svg>
  </Button>
</template>

<style scoped lang="scss">
.playButton {
  display: block;
  border-radius: 999px;
  aspect-ratio: 1/1;
  padding: 0;
  opacity: 0.85;

  :deep(.content) {
    display: flex;
  }

  &.playButton--hovered {
    transform: scale(0.9);
  }
}
.playButton__background {
  display: none;
}

.playButton__arrow {
  transition: transform 0.2s ease;
  transform-origin: center;
  fill: rgba(255, 255, 255, 0.75);
  transition:
    fill 0.2s ease,
    transform 0.2s ease;

  .playButton--hovered & {
    fill: $secondary-color-light;
    transform: scale(1.2);
  }
}
</style>

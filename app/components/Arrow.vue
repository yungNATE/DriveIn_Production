<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    orientation?: "left" | "right";
    isHovered?: boolean;
  }>(),
  {
    orientation: "right",
    isHovered: false,
  },
);

const rightPathD = "M2.62744 2.3125L13.6274 14.8125L2.62744 27.3125";
const leftPathD = "M16.37256 2.3125L5.3726 14.8125L16.37256 27.3125";
</script>

<template>
  <svg
    width="30"
    height="30"
    viewBox="0 0 19 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="orientation"
  >
    <path
      :d="props.orientation === 'left' ? leftPathD : rightPathD"
      stroke="white"
      stroke-width="7"
    />
  </svg>
</template>

<style scope lang="scss">
$offset: 5px;
.left {
  margin-right: $offset;
}
.right {
  margin-left: $offset;
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

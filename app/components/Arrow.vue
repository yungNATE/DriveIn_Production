<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    orientation?: "left" | "right" | "top" | "bottom";
    isHovered?: boolean;
  }>(),
  {
    orientation: "right",
    isHovered: false,
  },
);

const rightPathD = "M2.62744 2.3125L13.6274 14.8125L2.62744 27.3125";
const leftPathD = "M16.37256 2.3125L5.3726 14.8125L16.37256 27.3125";
const topPathD = "M2.3125 13.6274L14.8125 2.62744L27.3125 13.6274";
const bottomPathD = "M2.3125 2.62744L14.8125 13.6274L27.3125 2.62744";

const pathsByOrientation: Record<typeof props.orientation, string> = {
  left: leftPathD,
  right: rightPathD,
  top: topPathD,
  bottom: bottomPathD,
};
const path = pathsByOrientation[props.orientation];

//

const horizontalViewBox = "0 0 19 30";
const verticalViewBox = "0 0 30 19";

const directionByOrientation: Record<
  typeof props.orientation,
  "horizontal" | "vertical"
> = {
  left: "horizontal",
  right: "horizontal",
  top: "vertical",
  bottom: "vertical",
};
const direction = directionByOrientation[props.orientation];
const viewBox = direction == "horizontal" ? horizontalViewBox : verticalViewBox;
</script>

<template>
  <svg
    width="30"
    height="30"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="orientation"
  >
    <path :d="path" stroke="white" stroke-width="7" />
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
.top {
  margin-top: $offset;
}
.bottom {
  margin-bottom: $offset;
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

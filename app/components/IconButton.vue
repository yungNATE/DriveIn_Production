<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    noHover?: boolean;
    title: string;
  }>(),
  {
    noHover: false,
  },
);

const isHovered = ref(false);
</script>

<template>
  <Button
    :class="[
      'iconButton',
      { 'iconButton--hovered': !props.noHover && isHovered },
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :disableArrow="true"
    :title="title"
  >
    <slot />
  </Button>
</template>

<style scoped lang="scss">
.iconButton {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  aspect-ratio: 1/1;
  padding: 0;
  opacity: 0.85;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 25px;

  &.iconButton--hovered,
  &:hover {
    transform: scale(0.9);
  }
}
</style>

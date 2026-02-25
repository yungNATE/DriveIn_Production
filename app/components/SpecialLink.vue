<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    to: string | Record<string, any>;
    title?: string;
    disableArrow?: boolean;
  }>(),
  {
    disableArrow: false,
  },
);
</script>

<!-- components/SpecialLink.vue -->
<template>
  <NuxtLink :to="to" class="special_link underlined">
    <slot />
    <span v-if="!disableArrow"> →</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/main.scss";
.special_link {
  position: relative;
  color: rgba(255, 255, 255, 0.75);
  transition: 0.3s;
  display: block;
  width: fit-content;

  &:hover,
  &:focus {
    color: rgba(255, 255, 255, 1);
    text-decoration: none;
  }
}
</style>

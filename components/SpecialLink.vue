<script setup>
defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
});
</script>

<!-- components/SpecialLink.vue -->
<template>
  <NuxtLink :to="to" class="special_link" v-bind="$attrs">
    <slot />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.special_link {
  position: relative;
  color: rgba(255, 255, 255, 0.75);
  transition: 0.3s;
  display: block;
  width: fit-content;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    height: 0.2rem;
    width: 100%;
    transition: opacity 0.3s ease;
  }

  &::before {
    background: radial-gradient(
      ellipse at 50% 0,
      $primary-color-light 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 1;
    z-index: 1;
  }

  &::after {
    background: radial-gradient(
      ellipse at 50% 0,
      $secondary-color-dark 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0;
    z-index: 2;
  }

  &:hover {
    color: rgba(255, 255, 255, 1);
    text-decoration: none;

    &::before {
      opacity: 0;
    }

    &::after {
      opacity: 1;
    }
  }
}
</style>

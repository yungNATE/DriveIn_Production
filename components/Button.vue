<script lang="ts" setup>
const props = defineProps<{
  to: string | Record<string, any>;
}>();
</script>

<template>
  <NuxtLink :to="to" class="btn h3" v-bind="$attrs">
    <slot />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.btn {
  position: relative;
  color: rgba(255, 255, 255, 0.75);
  transition: 0.3s;
  background-color: black;
  padding: 0.5rem 2rem;
  border-radius: 7px;
  filter: drop-shadow(0 0 8px $primary-color-light);
  text-decoration: none;
  height: fit-content;
  width: fit-content;
  white-space: nowrap;

  &:hover {
    color: rgba(255, 255, 255, 1);
    text-decoration: none;
    filter: drop-shadow(0 0 8px $secondary-color-dark);
  }

  &.discret {
    @include glow-discret($primary-color-light);

    &:hover {
      @include glow-discret($secondary-color-dark);
    }
  }
}
</style>

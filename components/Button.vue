<template>
  <NuxtLink :to="to" class="btn h3" v-bind="$attrs">
    <slot />
  </NuxtLink>
</template>
<script lang="ts" setup></script>

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

  &:hover {
    color: rgba(255, 255, 255, 1);
    text-decoration: none;
    filter: drop-shadow(0 0 8px $secondary-color-dark);
  }
}
</style>

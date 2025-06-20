<script lang="ts" setup>
const props = defineProps<{
  src: string;
  alt: string;
  customClass: string;
}>();
</script>

<template>
  <div class="bloc-img-text" :class="customClass">
    <img :src="src" :alt="alt" />
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.bloc-img-text {
  display: flex;

  padding: 32px;
  gap: 50px;
  background-color: black;
  @include glow-discret($primary-color-light);
  border-radius: 12px;

  @include mediaquery(500) {
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .text {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &.blue {
    @include glow-discret($secondary-color-dark);
  }

  img {
    width: 150px;

    object-fit: cover;
    border-radius: 8px;
  }
}
</style>

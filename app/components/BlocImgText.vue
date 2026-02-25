<script lang="ts" setup>
const props = defineProps<{
  src: string;
  alt: string;
  customClass: string | undefined;
}>();
</script>

<template>
  <div class="bloc-img-text" :class="customClass">
    <NuxtImg :src="src" :alt="alt" />
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
  border-radius: 12px;

  @include mediaquery(600) {
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .text {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  img {
    width: 150px;

    object-fit: cover;
    border-radius: 8px;
  }
}
</style>

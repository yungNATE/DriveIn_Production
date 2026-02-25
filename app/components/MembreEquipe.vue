<script lang="ts" setup>
const props = defineProps<{
  src: string;
  alt: string;
  customClass: string | undefined;
}>();

const route = useRoute();
</script>

<template>
  <BlocImgText :src="src" :alt="alt" :customClass="customClass">
    <slot />
  </BlocImgText>
</template>

<style lang="scss" scoped>
.bloc-img-text {
  max-width: 350px;
  flex-direction: column;
  width: fit-content;

  :deep(img) {
    width: 100%;
    max-height: 200px;
    aspect-ratio: 1/1;
  }
}
</style>

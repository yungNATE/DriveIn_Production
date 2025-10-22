<script lang="ts" setup>
const props = defineProps<{
  src: string;
  alt: string;
  customClass: string | undefined;
}>();

const route = useRoute();
const isAboutPage = computed(() => route.path === "/about");
</script>

<template>
  <div>
    <BlocImgText :src="src" :alt="alt" :customClass="customClass">
      <slot />
      <SpecialLink to="/about" v-if="!isAboutPage"
        >Découvrir l’agence →</SpecialLink
      >
    </BlocImgText>
  </div>
</template>

<style lang="scss" scoped>
div {
  margin: auto;
}
:deep(.bloc-img-text) {
  max-width: 700px;

  img {
    max-height: 200px;
  }
}
</style>

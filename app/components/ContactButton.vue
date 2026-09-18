<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text?: string;
  }>(),
  {
    text: "Nous contacter",
  },
);
</script>

<template>
  <Button to="/nous-contacter" title="Notre page de contact">{{
    props.text
  }}</Button>
</template>

<style scoped>
.btn {
  font-weight: bold;
}
</style>

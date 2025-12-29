<template>
  <div :id="id" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { tsParticles } from "@tsparticles/engine";
import { useRuntimeConfig, useState } from "#app";
import type { Container, ISourceOptions } from "@tsparticles/engine";

const particlesLoaded = useState("__app_particles_loaded", () => false);
const container = ref<Container | undefined>(undefined);

const props = defineProps<{
  id: string;
  options?: ISourceOptions;
  url?: string;
}>();

const emit = defineEmits<{
  load: [container: Container];
}>();

const runtimeConfig = useRuntimeConfig();
const mode = runtimeConfig.public?.particles?.mode;

const ensureLoaded = async () => {
  if (particlesLoaded.value) {
    return;
  }

  tsParticles.init();

  if (mode === "basic") {
    const { loadBasic } = await import("@tsparticles/basic");
    await loadBasic(tsParticles);
  }

  particlesLoaded.value = true;
};

onMounted(async () => {
  await ensureLoaded();

  const particlesContainer = await tsParticles.load({
    id: props.id,
    options: props.options,
    url: props.url,
  });

  if (particlesContainer) {
    emit("load", particlesContainer);
    container.value = particlesContainer;
  }
});

onUnmounted(() => {
  container.value?.destroy();
});
</script>

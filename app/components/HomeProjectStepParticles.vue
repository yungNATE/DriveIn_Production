<template>
  <NuxtParticles :id="id" :options="options" @load="onLoad"> </NuxtParticles>
</template>

<script setup lang="ts">
import type { Container } from "@tsparticles/engine";

let props = defineProps<{
  id: string;
}>();

// See tsParticles documentation for all available options
const options = {
  fullScreen: {
    enable: true,
    zIndex: -2,
  },
  background: {
    color: {
      value: "#000",
    },
  },
  particles: {
    color: {
      value: "#656565",
    },
    links: {
      enable: false,
    },
    move: {
      speed: 0.3,
      enable: true,
    },
    size: {
      value: 1,
    },
    number: {
      value: 60,
    },
  },
  pauseOnOutsideViewport: true,
  fpsLimit: 60,
};

const onLoad = (container: Container) => {
  // Do something with the container
  container.pause();
  setTimeout(() => container.play(), 2000);
};
</script>

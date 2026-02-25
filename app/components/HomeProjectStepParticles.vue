<template>
  <NuxtParticles :id="id" :options="options"> </NuxtParticles>
</template>

<script setup lang="ts">
import type { Container } from "@tsparticles/engine";

let props = defineProps<{
  id: string;
}>();

// See tsParticles documentation for all available options
const options = {
  fullScreen: {
    enable: false,
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
</script>

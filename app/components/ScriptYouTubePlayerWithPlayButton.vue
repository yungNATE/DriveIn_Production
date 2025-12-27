<script lang="ts" setup>
let slots = useSlots();
let props = defineProps<{
  videoId: string;
  color: "white";
}>();
</script>

<template>
  <ScriptYouTubePlayer v-bind="props" class="video-player">
    <template v-if="slots.placeholder" #placeholder="slotProps">
      <slot name="placeholder" v-bind="slotProps" />
    </template>

    <template v-if="slots.loading" #loading="slotProps">
      <slot name="loading" v-bind="slotProps" />
    </template>

    <template v-if="slots.awaitingLoad" #awaitingLoad="slotProps">
      <slot name="awaitingLoad" v-bind="slotProps" />
    </template>

    <template v-else #awaitingLoad>
      <div class="youtube-logo-wrapper">
        <svg
          height="48"
          width="68"
          viewBox="0 0 68 48"
          version="1.1"
          aria-hidden="true"
        >
          <path
            d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
          />
          <path d="M 45,24 27,14 27,34" fill="#fff" />
        </svg>
      </div>
    </template>

    <template v-if="slots.error" #error="slotProps">
      <slot name="error" v-bind="slotProps" />
    </template>

    <slot />
  </ScriptYouTubePlayer>
</template>

<style lang="scss" scoped>
.video-player {
  position: relative;
  display: block;
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  filter: drop-shadow(0 0 25px rgba($primary-color-light, 0.5));
  transition: filter 0.3s ease;

  &:hover {
    filter: drop-shadow(0 0 25px $secondary-color-dark);
  }

  :deep(iframe) {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
  }
}

.youtube-logo-wrapper {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.667);
  display: flex;
  justify-content: center;
  align-items: center;

  :deep(svg path:first-of-type) {
    fill: $secondary-color-light;
    transition:
      fill 0.2s ease,
      transform 0.2s ease;
    transform-origin: center;
  }

  :deep(svg path:nth-of-type(2)) {
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  &:hover {
    :deep(svg path:first-of-type) {
      fill: rgba($secondary-color-dark, 0.3);
      transform: scale(0.9);
    }

    :deep(svg path:nth-of-type(2)) {
      transform: scale(1.1);
    }
  }
}
</style>

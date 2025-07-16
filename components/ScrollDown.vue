<script setup>
const props = defineProps({
  to: {
    type: [String],
    required: true,
  },
});

// On click, smooth scroll to the anchor
const anchor = computed(() => `#${props.to}`);
console.log(props);
</script>

<template>
  <a
    class="scroll-down"
    style="scroll-behavior: smooth"
    aria-label="Scroll jusqu'au contenu de la page"
    :href="anchor"
  >
    <div class="arrow-container">
      <img src="~/assets/icones/arrow.svg" alt="" />
    </div>
    <p class="h3">
      <slot></slot>
    </p>
  </a>
</template>

<style lang="scss" scoped>
.scroll-down {
  display: flex;
  align-items: flex-end;
  gap: 3rem;
  cursor: pointer;
  color: var(--secondary-color-dark);
  text-decoration: none;
  width: fit-content;

  .arrow-container {
    position: relative;

    &::before {
      content: "";
      display: block;
      width: 5rem;
      height: 5rem;
      background-color: transparent;
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%, 50%) scale(1.9);
      border-radius: 50%;
      background-color: $secondary-color-light;
      filter: blur(25px);
      opacity: 0.5;
      animation: pulse 3s infinite;
    }

    @keyframes pulse {
      0% {
        transform: translate(-50%, 50%);
      }

      50% {
        transform: translate(-50%, 50%) scale(1.2);
      }

      100% {
        transform: translate(-50%, 50%) scale(1);
      }
    }

    img {
      width: 2rem;
      height: auto;
      transition: transform 0.3s ease-in-out;
      position: relative;
      z-index: 1;
    }
  }

  &:hover img {
    transform: translateY(5px);
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
  }
}
</style>

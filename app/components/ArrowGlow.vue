<style></style>

<template>
  <div class="arrow-container">
    <img src="@/assets/icones/arrow.svg" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.arrow-container {
  position: relative;
  width: fit-content;
  height: fit-content;
  user-select: none;

  &::before {
    content: "";
    display: block;
    width: 3rem;
    aspect-ratio: 1/1;
    background-color: transparent;
    position: absolute;
    bottom: calc(50% - 30px);
    left: 50%;
    transform: translate(-50%, 50%);
    border-radius: 50%;
    background-color: $secondary-color-light;
    filter: blur(25px);
    animation: pulse 3s infinite;
    opacity: 0.75;
    transition: opacity 0.3s;
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
    // width: 1.5rem;
    height: auto;
    transition: transform 0.3s ease-in-out;
    position: relative;
    z-index: 1;
  }
}
</style>

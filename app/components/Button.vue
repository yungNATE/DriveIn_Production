<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    to?: string | Record<string, any>;
    title: string;
    disableArrow?: boolean;
  }>(),
  {
    disableArrow: false,
  },
);
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="btn" :title="title">
    <span class="content"><slot /></span>
    <span v-if="!disableArrow"> →</span>
  </NuxtLink>
  <button v-else class="btn" :title="title">
    <span class="content"><slot /></span>
    <span v-if="!disableArrow"> →</span>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  display: block;
  position: relative;
  color: rgba(255, 255, 255, 0.75);
  transition: 0.3s;
  padding: 0.5rem 2rem;
  border-radius: 7px;
  text-decoration: none;
  height: fit-content;
  width: fit-content;
  border: none;
  border: 1px solid #ffffff5c;
  overflow: hidden;
  background: transparent;

  &:before {
    --position: -25%;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 150%;
    height: 100%;
    transform: translateX(var(--position));
    background:
      linear-gradient(
        140deg,
        rgba(0, 0, 0, 0) 0%,
        rgb(17, 17, 17) 50%,
        rgba(0, 0, 0, 0) 100%
      ),
      black;
    transition: transform 0.3s;
  }

  &:hover:before {
    --position: 0%;
  }

  &:hover {
    color: rgba(255, 255, 255, 1);
    text-decoration: none;
    cursor: pointer;
  }
}

.CTA {
  font-size: clamp(14px, 4vw, 1.5rem);
}

:deep(span) {
  position: relative;
  width: 100%;

  .content {
    display: flex;
  }
}
</style>

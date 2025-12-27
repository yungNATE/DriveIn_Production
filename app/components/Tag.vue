<script lang="ts" setup>
const props = defineProps<{
  tag: {
    id: string;
    title: string;
    isInactive?: boolean;
    hidden: boolean;
    associatedIcon?: string;
  };
}>();

defineEmits(["select"]);
</script>

<template>
  <span class="tag" @click="$emit('select', tag.id)">
    <span>#{{ tag.title }}</span>
    <span v-if="tag.isInactive == true">isInative</span>
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.1254 4.0619C8.1254 4.95826 7.83437 5.78626 7.34411 6.45804L9.81689 8.93229C10.061 9.17639 10.061 9.57282 9.81689 9.81692C9.57273 10.061 9.17623 10.061 8.93208 9.81692L6.4593 7.34267C5.78739 7.83479 4.95923 8.12381 4.0627 8.12381C1.81845 8.12381 0 6.30572 0 4.0619C0 1.81809 1.81845 0 4.0627 0C6.30695 0 8.1254 1.81809 8.1254 4.0619ZM4.0627 6.87399C4.43206 6.87399 4.7978 6.80126 5.13905 6.65994C5.48029 6.51862 5.79036 6.31148 6.05153 6.05035C6.31271 5.78922 6.51989 5.47922 6.66124 5.13804C6.80259 4.79687 6.87534 4.43119 6.87534 4.0619C6.87534 3.69262 6.80259 3.32694 6.66124 2.98577C6.51989 2.64459 6.31271 2.33458 6.05153 2.07346C5.79036 1.81233 5.48029 1.6052 5.13905 1.46387C4.7978 1.32255 4.43206 1.24982 4.0627 1.24982C3.69334 1.24982 3.32759 1.32255 2.98635 1.46387C2.6451 1.6052 2.33504 1.81233 2.07386 2.07346C1.81269 2.33458 1.60551 2.64459 1.46416 2.98577C1.32281 3.32694 1.25006 3.69262 1.25006 4.0619C1.25006 4.43119 1.32281 4.79687 1.46416 5.13804C1.60551 5.47922 1.81269 5.78922 2.07386 6.05035C2.33504 6.31148 2.6451 6.51862 2.98635 6.65994C3.32759 6.80126 3.69334 6.87399 4.0627 6.87399Z"
        fill="white"
      />
    </svg>
  </span>
</template>

<style lang="scss" scoped>
@use "sass:color";

.tag {
  cursor: pointer;
  color: white;
  @include glow-discret($primary-color-light);
  background: black;
  padding: 3px 10px;
  width: fit-content;
  user-select: none;
  border-radius: 5px;
  transition: filter 0.3s ease;

  display: flex;
  gap: 7px;
  align-items: center;

  svg {
    width: 10px;
    height: 10px;

    path {
      transition: fill 0.3s ease;
      fill: rgba($primary-color-light, 0.3);
    }
  }

  &:not(.inactive):hover {
    @include glow-discret($secondary-color-dark);
    svg path {
      fill: $secondary-color-dark;
    }
  }

  &.selected {
    @include glow-discret($secondary-color-dark);
    svg {
      display: none;
    }
  }

  &.inactive {
    user-select: text;
    cursor: default;
    filter: none;
    font-size: 0.8rem;

    svg {
      display: none;
    }
  }
}
</style>

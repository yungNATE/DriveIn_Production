<script lang="ts" setup>
const {
  data: partners,
  pending,
  error,
} = await useAsyncData("partners", async () => {
  const data = await queryCollection("partners").all();
  return flattenMeta(data);
});
</script>

<template>
  <NuxtMarquee class="marquee">
    <div v-for="partner in partners" :key="partner._id" class="marquee-child">
      <NuxtImg :src="partner.logo" :alt="`Logo de ${partner.name}`" />
    </div>
  </NuxtMarquee>
</template>

<style>
.marquee {
  mask-image: linear-gradient(
    90deg,
    transparent,
    rgba(0, 0, 0, 1) 10% 90%,
    transparent
  );

  .marquee-child {
    margin-inline: 30px;

    img {
      min-width: 125px;
      max-height: 75px;
    }
  }
}
</style>

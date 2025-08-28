<script setup lang="ts">
const { isScrolled, y } = useScrollState();
</script>

<template>
  <SiteHeader />

  <main :class="{ scrolled: isScrolled }" :data-scrolled-y="y">
    <NuxtPage />
  </main>

  <SiteFooter />
</template>

<style lang="scss">
html,
body {
  margin: 0; /* pour éviter les marges par défaut */
  padding: 0; /* idem pour les paddings */
  min-height: 100vh; /* optionnel, min-height viewport height */
  font-size: 16px;
}
#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
  margin-top: $header-height;
}
</style>

<script lang="ts" setup>
import { flattenMeta } from "@/utils/flattenMeta";

definePageMeta({
  title: "Plan du site",
});

const staticPages = [
  { to: "/", label: "Accueil" },
  { to: "/notre-agence", label: "L'agence" },
  { to: "/nos-projets", label: "Réalisations" },
  { to: "/conseils", label: "Nos conseils" },
  { to: "/nous-contacter", label: "Nous contacter" },
] as const;

const {
  data: projets,
  pending: pendingProjets,
  error: errorProjets,
} = await useAsyncData("sitemap-nosProjets", async () => {
  const data = await queryCollection("nosProjets").all();
  const items = flattenMeta(data);
  // Weight desc if available, otherwise keep source order
  return items.sort((a: any, b: any) => (b.weight || 0) - (a.weight || 0));
});

const {
  data: conseils,
  pending: pendingConseils,
  error: errorConseils,
} = await useAsyncData("sitemap-conseils", async () => {
  const data = await queryCollection("conseils").all();
  const items = flattenMeta(data);
  return items;
});

const isPending = computed(() => pendingProjets.value || pendingConseils.value);
const hasError = computed(() => Boolean(errorProjets.value || errorConseils.value));
</script>

<template>
  <section class="plan-du-site">
    <div class="container">
      <h1>plan du site</h1>

      <div class="static-pages">
        <SpecialLink
          v-for="page in staticPages"
          :key="page.to"
          :to="page.to"
        >
          {{ page.label }}
        </SpecialLink>
      </div>

      <div v-if="isPending" class="state">Chargement…</div>
      <div v-else-if="hasError" class="state">Une erreur est survenue.</div>

      <template v-else>
        <div class="content-container">
          <h2 class="h3">Nos projets</h2>
          <div class="content-links">
            <SpecialLink
              v-for="item in projets || []"
              :key="item.path || item._path"
              :to="item.path || item._path"
            >
              {{ item.title || "Projet" }}
            </SpecialLink>
          </div>
        </div>

        <div class="content-container">
          <h2 class="h3">Conseils</h2>
          <div class="content-links">
            <SpecialLink
              v-for="item in conseils || []"
              :key="item.path || item._path"
              :to="item.path || item._path"
            >
              {{ item.question || item.title || "Conseil" }}
            </SpecialLink>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.plan-du-site {
  padding: 60px 0 80px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;

  display: flex;
  flex-direction: column;
  gap: 40px;
}

.static-pages {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.content-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.state {
  opacity: 0.8;
}
</style>

<script lang="ts" setup>
const contentType = "projects";
const {
  data: projets,
  pending,
  error,
} = await useAsyncData(contentType, async () => {
  const data = await queryCollection(contentType).all();
  return flattenMeta(data);
});

const items = [
  {
    title: "First",
    description: "The first item.",
  },
  {
    title: "Second",
    description: "The second item.",
  },
];
</script>

<template>
  <div class="projets-page">
    <h1 class="sr-only">Les projets de nos clients - DriveIn Production !</h1>

    <section class="header">
      <h1>Nos réalisations</h1>
      <Button to="/contact">Prendre rendez-vous →</Button>
    </section>

    <section class="filter" aria-controls="filteredProjects"></section>

    <section
      id="filteredProjects"
      aria-live="polite"
      aria-labelledby="filteredProjectsTitle"
    >
      <h2 id="filteredProjectsTitle" class="sr-only">Résultats des projets</h2>
      <masonry-wall
        :items="projets"
        :ssr-columns="1"
        :column-width="300"
        :gap="16"
      >
        <template #default="{ item, index }">
          <GlowElement
            :style="{
              height: `${(index + 1) * 100 * Math.floor(Math.random() * 10)}px`,
            }"
          >
            <p>{{ item.title }}</p>
            <span>{{ item.presentation }}</span>
            <img :src="item.cover" :alt="`Image de couverture ${item.title}`" />
            <NuxtLink :to="item.path" class="read-more">
              Lire la suite →
            </NuxtLink>
          </GlowElement>
        </template>
      </masonry-wall>
    </section>
  </div>
</template>

<style scoped>
section.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5rem;
}

section#filteredProjects {
  :deep(.masonry-item) {
    > div {
      position: relative;
      width: 100%;

      > * {
        position: relative;
        z-index: 2;
      }

      img {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        object-fit: cover;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
      }
    }
  }
}

.projets-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error,
.no-projects {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
}

.projets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.projet-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.projet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.projet-card h2 {
  margin: 0 0 1rem 0;
  color: #007acc;
  font-size: 1.4rem;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.metadata {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.date {
  color: #888;
}

.category {
  background: #007acc;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.read-more {
  display: inline-block;
  color: #007acc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.read-more:hover {
  color: #005c99;
  text-decoration: underline;
}
</style>

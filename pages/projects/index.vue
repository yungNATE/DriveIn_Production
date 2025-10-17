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
      <div class="content"></div>
    </section>

    <div v-if="pending" class="loading">Chargement des projets...</div>

    <div v-else-if="error" class="error">
      Erreur lors du chargement des projets
    </div>

    <div v-else-if="projets" class="projets-grid">
      <article v-for="projet in projets" :key="projet._id" class="projet-card">
        <h2>{{ projet.title || "Projet sans titre" }}</h2>
        <p v-if="projet.description" class="description">
          {{ projet.description }}
        </p>
        <div class="metadata">
          <span v-if="projet.date" class="date">
            {{ projet.date }}
          </span>
          <span v-if="projet.category" class="category">
            {{ projet.category }}
          </span>
        </div>
        <NuxtLink :to="projet.path" class="read-more">
          Lire la suite →
        </NuxtLink>
      </article>
    </div>

    <div v-else class="no-projects">Aucun projet trouvé.</div>
  </div>
</template>

<style scoped>
section.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5rem;
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

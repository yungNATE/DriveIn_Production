<template>
  <div class="projets-page">
    <h1>Nos Projets</h1>

    <div v-if="pending" class="loading">Chargement des projets...</div>

    <div v-else-if="error" class="error">
      Erreur lors du chargement des projets
    </div>

    <div v-else-if="projets && projets.length > 0" class="projets-grid">
      <article v-for="projet in projets" :key="projet._id" class="projet-card">
        <h2>{{ projet.title || "Projet sans titre" }}</h2>
        <p v-if="projet.description" class="description">
          {{ projet.description }}
        </p>
        <div class="metadata">
          <span v-if="projet.date" class="date">
            {{ formatDate(projet.date) }}
          </span>
          <span v-if="projet.category" class="category">
            {{ projet.category }}
          </span>
        </div>
        <NuxtLink :to="projet._path" class="read-more">
          Voir le projet →
        </NuxtLink>
      </article>
    </div>

    <div v-else class="no-projects">Aucun projet trouvé.</div>

    <NuxtLink to="/projets/axa-france">Voir le projet Axa France</NuxtLink>
  </div>
</template>

<script setup>
// Récupération des projets avec queryCollection
const { data: projets, pending, error } = await queryCollection("projets");
// .sort({ date: -1 }) // Tri par date décroissante
// .find();

/*
 *
 *
 * QUE PASA ??????? ^^^^^
 * Pourquoi je ne peux pas utiliser .sort() ici ?
 * Parce que queryCollection retourne un objet avec des méthodes chainables,
 * mais pas un tableau direct.
 * Donc, on ne peut pas utiliser .sort() directement.
 * On doit trier les projets après récupération.
 * On peut utiliser computed pour trier les projets après récupération.
 * * Exemple :
 * * const sortedProjets = computed(() => {
 * *   return projets.value ? [...projets.value].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
 * * });
 * * Mais pour l'instant, on va juste récupérer les projets sans tri.
 */

// Fonction pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Meta tags pour SEO
useSeoMeta({
  title: "Nos Projets - DriveIn Production",
  description: "Découvrez tous nos projets de production audiovisuelle",
});
</script>

<style scoped>
.projets-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  font-size: 2.5rem;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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

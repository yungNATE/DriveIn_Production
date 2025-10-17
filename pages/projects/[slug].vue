<script lang="ts" setup>
// Récupération du slug depuis la route
const route = useRoute();
const slug = route.params.slug as string;

const { data, pending, refresh } = await useAsyncData(() =>
  queryCollection("content")
    .path("/projets/" + slug)
    .first()
);

const projet = computed(() => {
  if (!data.value) return {};

  const content = data.value as any;

  return {
    ...content, // titre, etc. au niveau racine
    ...content.meta, // présentation, types, etc. depuis meta
  };
});
</script>

<template>
  <div v-if="pending" class="loading">Chargement du projet...</div>

  <div v-else-if="!projet.title" class="error">
    Projet non trouvé.
    <button @click="() => refresh()">Réessayer</button>
  </div>

  <div v-else class="projet-detail">
    <article class="projet">
      <!-- Titre principal -->
      <header class="projet-header">
        <h1>{{ projet.title }}</h1>
      </header>

      <!-- Présentation -->
      <section class="presentation">
        <p>{{ projet.presentation }}</p>
      </section>

      <!-- Types -->
      <section v-if="projet.types && projet.types.length" class="types">
        <h3>Types</h3>
        <div class="types-list">
          <span v-for="type in projet.types" :key="type" class="type-badge">
            {{ type }}
          </span>
        </div>
      </section>

      <!-- Vidéo -->
      <section v-if="projet.video" class="video">
        <h3>Vidéo</h3>
        <div class="video-container">
          <iframe
            :src="projet.video"
            frameborder="0"
            allowfullscreen
            title="Vidéo du projet"
          ></iframe>
        </div>
      </section>

      <!-- Client -->
      <section v-if="projet.client && projet.client.length" class="client">
        <h3>Client{{ projet.client.length > 1 ? "s" : "" }}</h3>
        <ul class="client-list">
          <li v-for="clientName in projet.client" :key="clientName">
            {{ clientName }}
          </li>
        </ul>
      </section>

      <!-- Tags -->
      <section v-if="projet.tags && projet.tags.length" class="tags">
        <h3>Tags</h3>
        <div class="tags-list">
          <span v-for="tag in projet.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.projet-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.projet-header {
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
}

.projet-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.presentation {
  margin-bottom: 2rem;
}

.presentation p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

section {
  margin-bottom: 2rem;
}

section h2,
section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

section h2 {
  font-size: 1.8rem;
}

section h3 {
  font-size: 1.4rem;
}

.types-list,
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.type-badge {
  background: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.tag {
  background: #f8f9fa;
  color: #495057;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  border: 1px solid #dee2e6;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* Ratio 16:9 */
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.client-list {
  list-style: none;
  padding: 0;
}

.client-list li {
  background: #f8f9fa;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  border-left: 4px solid #28a745;
  font-weight: 500;
}

@media (max-width: 768px) {
  .projet-detail {
    padding: 1rem;
  }

  .projet-header h1 {
    font-size: 2rem;
  }

  .types-list,
  .tags-list {
    justify-content: center;
  }
}
</style>

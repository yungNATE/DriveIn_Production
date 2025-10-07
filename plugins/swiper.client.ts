// Plugin global pour enregistrer les Web Components Swiper une seule fois côté client
// Cela évite de devoir appeler `register()` dans chaque page où l'on utilise
// <swiper-container> et <swiper-slide>, et corrige le problème d'absence de Swiper
// sur des pages visitées directement (ex: /about) où le code d'index.vue ne s'exécute pas.

import { register } from 'swiper/element/bundle';

// Protection contre double enregistrement si HMR ou navigation (register est idempotent)
try {
  if (!(customElements.get('swiper-container') && customElements.get('swiper-slide'))) {
    register();
  }
} catch (e) {
  // Soft fail: ne pas casser l'appli si une erreur survient (ex build SSR inattendu)
  console.warn('[swiper.plugin] Échec de l\'enregistrement Swiper:', e);
}

export default defineNuxtPlugin(() => {
  // Pas de logique additionnelle requise pour l'instant.
});

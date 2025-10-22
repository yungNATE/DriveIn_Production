<template>
  <transition name="loader" @after-leave="onAfterLeave">
    <div v-if="show" class="page-loader" aria-hidden="true">
      <video
        src="/loading_logo_animated.mp4"
        preload="auto"
        class="loader-video"
        autoplay
        muted
        playsinline
        loop
      ></video>
      <span class="loader-title h2">{{ targetTitle }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const show = ref(false);
const targetTitle = ref("");
const router = useRouter();

let nextCallback; // fonction next() qu'on retient
let minDurationDone = false;

router.beforeEach((to, from, next) => {
  // Ignore navigation if only the hash changes (e.g., #presentation)
  if (to.path === from.path && to.hash !== from.hash) {
    next();
    return;
  }
  show.value = true;
  minDurationDone = false;
  targetTitle.value = to.meta.title || "Chargement...";

  nextCallback = next; // retient next pour l'appeler plus tard

  // Délai minimum 2500 ms (ajuste si besoin)
  setTimeout(() => {
    minDurationDone = true;
    if (nextCallback) {
      nextCallback();
      nextCallback = null;
    }
  }, 2050);
  // }, 1210); // Durée vidéo 1
  // }, 2050); // Durée vidéo 2
});

// Après navigation réussie, on cache le loader
router.afterEach(() => {
  // Ici on peut cacher le loader directement, ou attendre un peu si tu veux
  show.value = false;
});
</script>

<style scoped>
/* Transition fade du loader (fond noir) */
.loader-enter-from {
  opacity: 0;
}
.loader-enter-active {
  transition: opacity 0.5s ease;
}
.loader-enter-to {
  opacity: 1;
}

.loader-leave-from {
  opacity: 1;
}
.loader-leave-active {
  transition: opacity 0.5s ease;
}
.loader-leave-to {
  opacity: 0;
}

/* Loader plein écran */
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 9999;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

/* Vidéo avec fade-in différé */
.loader-video {
  width: 500px;
  height: auto;
  max-width: 60vw;

  opacity: 0;
  animation: fadeInVideo 0.3s ease forwards;
  animation-delay: 0.2s;
}

@keyframes fadeInVideo {
  to {
    opacity: 1;
  }
}

/* Titre sous la vidéo */
.loader-title {
  margin-top: 1rem;
  color: white;
}
</style>

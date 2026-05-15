<script lang="ts" setup>
// Récupération des avis Google
const { data: googleComments } = await useAsyncData(
  "googleComments",
  async () => {
    const data = await queryCollection("googleComments").all();
    return flattenMeta(data);
  },
);

// Constante DRY pour la note maximale
const RATING_MAX = 5;
// Breakpoints Swiper: < 750px => 1 slide, >= 750px => 3 slides
const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1 },
  1000: { slidesPerView: 3 },
};

// Moyenne des notes (brute)
const averageRating = computed(() => {
  const arr = googleComments.value || [];
  if (!arr.length) return 0;
  const total = arr.reduce(
    (acc: number, c: any) => acc + Number(c.rating || 0),
    0,
  );
  return total / arr.length;
});
// (ancienne déclaration averageRatingDisplay supprimée pour éviter doublon)

// (fractions maintenant gérées par composant Stars)
// Version formatée sur 2 décimales puis suppression des zéros finaux inutiles (ex: 4.70 -> 4.7, 5.00 -> 5)
const averageRatingDisplay = computed(() => {
  const fixed = averageRating.value.toFixed(2); // toujours 2 décimales
  return fixed.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0$/, "$1");
});
// Pour les étoiles (arrondi entier classique)
const roundedAverageRating = computed(() => Math.round(averageRating.value));

// Tri naturel par numéro dans le nom de fichier (comment1, comment2, ... comment10)
const sortedComments = computed(() => {
  if (!googleComments.value) return [];
  return [...googleComments.value].sort((a: any, b: any) => {
    const extract = (val: any) => {
      const source = val?._id || val?._path || "";
      const m = source.match(/comment(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    };
    return extract(a) - extract(b);
  });
});

// Limite de caractères avant d'afficher "Voir plus"
const COMMENT_LIMIT = 115;

// Prépare chaque commentaire avec une version tronquée (sans couper le dernier mot)
const preparedComments = computed(() => {
  return sortedComments.value.map((c: any, index: number) => {
    const raw: string = (c.comment || "").trim();
    // Génération d'un id stable et unique (évite undefined -> expansion globale)
    const syntheticId = c._id || c._path || c.slug || `comment-${index}`;
    if (raw.length <= COMMENT_LIMIT) {
      return { ...c, id: syntheticId, short: raw, needsTruncate: false };
    }
    const slice = raw.slice(0, COMMENT_LIMIT + 1);
    const lastSpace = slice.lastIndexOf(" ");
    const short =
      lastSpace > 0 ? slice.slice(0, lastSpace) : raw.slice(0, COMMENT_LIMIT);
    return { ...c, id: syntheticId, short, needsTruncate: true };
  });
});

// Gestion de l'état "déployé" par id
const expanded = ref<Set<string>>(new Set());
function isExpanded(id: string) {
  return expanded.value.has(id);
}
function expand(id: string) {
  expanded.value.add(id);
  pauseAutoplayOnExpand();
}

// Conserver l'expansion uniquement pour la slide active
function collapseInactive() {
  const el: any = swiperRoot.value;
  if (!el || !el.swiper) return;
  const realIndex = el.swiper.realIndex ?? el.swiper.activeIndex;
  const current = preparedComments.value[realIndex];
  if (!current) {
    expanded.value.clear();
    resumeAutoplayIfNeeded();
    return;
  }
  const keepId = current.id;
  if (!expanded.value.has(keepId) || expanded.value.size > 1) {
    expanded.value = new Set(
      keepId && expanded.value.has(keepId) ? [keepId] : [],
    );
  }
  if (expanded.value.size === 0) {
    resumeAutoplayIfNeeded();
  }
}

// --- Autoplay management (pause when expanded) ---
const pausedByExpand = ref(false);
function pauseAutoplayOnExpand() {
  const el: any = swiperRoot.value;
  if (!el?.swiper?.autoplay) return;
  if (expanded.value.size > 0 && !pausedByExpand.value) {
    try {
      el.swiper.autoplay.stop();
    } catch {}
    pausedByExpand.value = true;
  }
}
function resumeAutoplayIfNeeded() {
  const el: any = swiperRoot.value;
  if (!el?.swiper?.autoplay) return;
  if (pausedByExpand.value && expanded.value.size === 0) {
    try {
      el.swiper.autoplay.start();
    } catch {}
    pausedByExpand.value = false;
  }
}

// Référence swiper pour ajuster la configuration loop après init
const swiperRoot = ref<HTMLElement | null>(null);

function rebuildLoop() {
  const el: any = swiperRoot.value;
  if (!el || !el.swiper) return;
  const total = sortedComments.value.length;
  if (!total) return;
  // Ajuster le nombre de slides loopées
  el.swiper.params.loopedSlides = total;
  // Reconstruire la loop proprement
  if (el.swiper.loopDestroy) {
    el.swiper.loopDestroy();
    el.swiper.loopCreate();
    el.swiper.updateSlides();
    el.swiper.updateProgress();
    el.swiper.updateSlidesClasses();
  }
}

async function ensureSwiperInit() {
  const el: any = swiperRoot.value;
  if (!el || !sortedComments.value.length) return;
  if (!customElements.get("swiper-container")) {
    await customElements.whenDefined("swiper-container");
  }
  // Force props as element properties to avoid attribute string coercion in prod
  el.breakpoints = SWIPER_BREAKPOINTS;
  el.slidesPerView = 3;
  if (!el.swiper && typeof el.initialize === "function") {
    try {
      el.initialize();
    } catch {}
  }
  if (!el.swiper) return;
  el.swiper.params.breakpoints = SWIPER_BREAKPOINTS;
  el.swiper.params.slidesPerView = el.slidesPerView;
  el.swiper.update();
  rebuildLoop();
  el.swiper.off("slideChange", collapseInactive);
  el.swiper.on("slideChange", collapseInactive);
  collapseInactive();
}

onMounted(() => {
  nextTick().then(() => ensureSwiperInit());
});

watch(sortedComments, () => {
  // Attendre le DOM puis (re)initialiser le swiper
  nextTick().then(() => ensureSwiperInit());
});

watch(expanded, () => {
  // ensure autoplay respects current expansion state
  if (expanded.value.size > 0) pauseAutoplayOnExpand();
  else resumeAutoplayIfNeeded();
});
</script>

<template>
  <div class="googleComments container">
    <div class="header">
      <div class="brand">
        <h2>Avis Google</h2>
        <div
          class="rating noteMoyenne"
          v-if="googleComments && googleComments.length"
        >
          <span class="value sr-only">{{ averageRatingDisplay }}</span>
          <span class="separator sr-only">/ {{ RATING_MAX }}</span>
          <Stars
            class="stars-primary"
            :value="Number(averageRating)"
            :max="RATING_MAX"
            :size="30"
            :duration="2000"
            animated
          />
        </div>
      </div>
      <div class="swiper-nav">
        <SwiperButton
          class="swiper-prev unstyled"
          aria-label="Précédent"
          title="Précédent"
          orientation="left"
        />
        <SwiperButton
          class="swiper-next unstyled"
          aria-label="Suivant"
          title="Suivant"
          orientation="right"
        />
      </div>
    </div>
    <div class="slider">
      <swiper-container
        ref="swiperRoot"
        :init="false"
        :navigation="true"
        navigation-prev-el=".googleComments .swiper-prev"
        navigation-next-el=".googleComments .swiper-next"
        :slides-per-view="3"
        :breakpoints="SWIPER_BREAKPOINTS"
        :loop="true"
        :autoplay-delay="5000"
        :autoplay-disable-on-interaction="false"
        :watch-slides-progress="true"
        :looped-slides="sortedComments.length"
        :centered-slides="true"
        :speed="700"
        :allow-touch-move="false"
      >
        <swiper-slide
          v-for="comment in preparedComments"
          :key="comment.id"
          class="slide"
        >
          <article class="comment">
            <header>
              <h3 class="author h3">{{ comment.author }}</h3>
              <div
                class="rating"
                :aria-label="`Note: ${comment.rating} sur ${RATING_MAX}`"
              >
                <Stars
                  class="stars-primary"
                  :value="Number(comment.rating)"
                  :max="RATING_MAX"
                  :size="20"
                />
              </div>
            </header>
            <p class="text">
              <span v-if="!comment.needsTruncate || isExpanded(comment.id)">
                {{ comment.comment }}
              </span>
              <span v-else>
                {{ comment.short }}…
                <button
                  type="button"
                  class="seeMore"
                  @click="expand(comment.id)"
                  aria-label="Afficher l'intégralité du commentaire"
                >
                  Voir plus
                </button>
              </span>
            </p>
          </article>
        </swiper-slide>
      </swiper-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

div.googleComments {
  position: relative;

  .header {
    margin-bottom: 40px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 40px 150px;
    flex-wrap: wrap;

    .brand {
      display: flex;
      align-items: center;
      gap: 20px;

      .googleLogo {
        width: 60px;
        height: auto;
      }

      .noteMoyenne {
        align-items: center;
        gap: 10px;
        font-size: 1.1rem;

        .value {
          font-size: 2rem;
          font-weight: 700;
          color: $primary-color-light;
        }
      }
    }
  }

  .slider {
    position: relative;

    swiper-container {
      width: 100%;

      swiper-slide {
        display: flex;
        justify-content: center;
        transition:
          transform 0.4s ease,
          opacity 0.4s ease;
        opacity: 0.15;
        transform: scale(0.6);
        pointer-events: none; // désactive interactions pour les slides non actives

        &.swiper-slide-prev,
        &.swiper-slide-next {
          opacity: 0.5;
          transform: scale(0.8);
        }
        &.swiper-slide-active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto; // réactive uniquement la slide active
        }

        .comment {
          padding: 30px 40px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: black;
          width: 100%;
          max-width: 520px;

          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
          }
          .text {
            line-height: 1.5;
            .seeMore {
              background: none;
              border: none;
              color: $primary-color-light;
              font-weight: 600;
              cursor: pointer;
              padding: 0 0 0 6px;
              font-size: 0.95em;
              text-decoration: underline;
              transition: color 0.25s;
              &:hover,
              &:focus-visible {
                color: color.scale($primary-color-light, $lightness: 20%);
              }
            }
          }
        }
      }
    }

    .swiper-nav {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      gap: 60px;
    }
  }

  // Couleur forcée pour les étoiles (fill + stroke via currentColor)
  .stars-primary {
    --star-color: $primary-color-light;
    color: $primary-color-light;
  }
}
</style>

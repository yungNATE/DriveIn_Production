<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, unref } from "vue";
import { useHeaderVisibility } from "~/composables/useHeaderVisibility";
import { getAllTags, type ProjectTag } from "~~/lib/tags";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Swiper
const swiperRef = ref<HTMLElement | null>(null);

let duration = 0;
let distanceRatio = 0;
let startTimer;
const isPlaying = ref(true);
let clickable = true;

// --- Image dynamique pour etapesProjet ---
const currentEtapeSlideIndex = ref(0);
const currentEtapeNumber = computed(() => currentEtapeSlideIndex.value + 1);
const currentEtapeImageSrc = computed(
  () => `/images/projectSteps/etape${currentEtapeNumber.value}.png`
);
// Handler déclenché au changement de slide Swiper (web component event)
// --- ScrollTrigger sync (to éviter la latence de dépin) ---
let etapesScrollTrigger: ScrollTrigger | null = null;
let totalEtapesSlides = 0;

function handleEtapesSlideChange(e: Event) {
  const swiper = (e as CustomEvent).detail?.[0];
  if (!swiper) return;
  currentEtapeSlideIndex.value =
    swiper.realIndex ?? swiper.activeIndex ?? currentEtapeSlideIndex.value;

  // Si le ScrollTrigger est actif, on avance proportionnellement la scroll position
  if (etapesScrollTrigger && totalEtapesSlides > 1) {
    const st = etapesScrollTrigger;
    // Progression théorique du scroll basée sur l'index de slide
    const perSlide = 1 / (totalEtapesSlides - 1);
    const targetProgress = Math.min(
      1,
      Math.max(0, currentEtapeSlideIndex.value * perSlide)
    );
    const targetScrollY = st.start + (st.end - st.start) * targetProgress;
    // Ajuste le scroll réel pour que ScrollTrigger soit déjà presque à la fin
    // -> le prochain wheel après la dernière slide libèrera immédiatement le pin
    window.scrollTo({ top: targetScrollY });
  }
}

// Préchargement des images des étapes (slides + image dynamique)
function preloadEtapesImages() {
  try {
    const urls = new Set<string>();
    // Dynamic step overlay images (etape1.png ... etapeN.png)
    const count = projectStepHome?.value?.length || 0;
    for (let i = 1; i <= count; i++) {
      urls.add(`/images/projectSteps/etape${i}.png`);
    }
    // Images déclarées dans le contenu (front-matter .img)
    projectStepHome?.value?.forEach((e: any) => {
      if (e?.img && typeof e.img === "string") urls.add(e.img);
    });
    // Préchargement basique via objets Image
    urls.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  } catch (err) {
    // Soft fail: ne rien bloquer si erreur
    console.warn("Préchargement étapes échoué", err);
  }
}

onMounted(async () => {
  const swiperEl = swiperRef.value;
  if (swiperEl) {
    if (swiperEl) {
      const { injectSwiperPaginationCurrentStyle } =
        await import("@/utils/inject-swiper-style.js");
      injectSwiperPaginationCurrentStyle(swiperEl);
    }
  }

  // Animation d'entrée de la section hero
  const hero = document.querySelector(".hero");
  // retirer la classe invisible juste avant de lancer la timeline
  if (hero) hero.classList.remove("invisible");
  const tl = gsap.timeline();
  const HERO_DURATION = 2;
  const HERO_DELAY = 0.5;
  tl.from(".hero .text", {
    x: 120,
    opacity: 0,
    duration: HERO_DURATION,
    ease: "power3.out",
  })
    .from(
      ".hero .video-player-wrapper",
      {
        x: -120,
        opacity: 0,
        duration: HERO_DURATION,
        ease: "power3.out",
      },
      // Démarre 0.2s après le début de l'animation précédente (overlap)
      `<+=${HERO_DELAY}`
    )
    .from(
      ".hero .scroll-down",
      {
        y: 60,
        opacity: 0,
        duration: HERO_DURATION,
        ease: "power3.out",
      },
      // Idem, chevauchement contrôlé
      `<+=${HERO_DELAY}`
    );

  // Force a layout/resize tick once visible so iframe-based players re-measure correctly
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
  tl.eventCallback("onComplete", () => {
    window.dispatchEvent(new Event("resize"));
  });

  // Pin de la section Étapes Projet lorsque son haut touche le haut de l'écran
  // (utilise le ref si dispo, sinon fallback sur le sélecteur)
  const etapesSection =
    sectionProjet.value ||
    (document.querySelector(
      ".etapesProjets, .etapesProjet"
    ) as HTMLElement | null);
  if (etapesSection) {
    // Util for retrieving the Swiper instance of the vertical steps carrousel
    const getEtapesSwiper = () => {
      const el = (etapesSection.querySelector(".etapes swiper-container") ||
        etapesSection.querySelector("swiper-container")) as any;
      return el && el.swiper ? (el.swiper as any) : null;
    };

    let isCooling = false;
    // Cooldown réduit pour plus de réactivité (latence perçue moindre)
    const COOLDOWN = 250; // ms entre changements de slides
    let touchStartY = 0;
    let detachHandlers = () => {};

    const attachScrollHandlers = () => {
      const target = etapesSection;
      if (!target) return;
      // Safety: remove previous handlers if any (re-entrance)
      detachHandlers();

      const wheelHandler = (e: WheelEvent) => {
        const swiper = getEtapesSwiper();
        if (!swiper) return;
        if (isCooling) return;
        const dir = e.deltaY > 0 ? 1 : -1;
        // If we're at the boundary, let the page scroll
        if ((dir > 0 && swiper.isEnd) || (dir < 0 && swiper.isBeginning)) {
          return; // don't preventDefault -> allow natural scroll to exit pin region
        }
        e.preventDefault();
        if (dir > 0) swiper.slideNext();
        else swiper.slidePrev();
        isCooling = true;
        setTimeout(() => (isCooling = false), COOLDOWN);
      };

      const touchStartHandler = (e: TouchEvent) => {
        touchStartY = e.touches[0]?.clientY || 0;
      };
      const touchMoveHandler = (e: TouchEvent) => {
        const swiper = getEtapesSwiper();
        if (!swiper) return;
        if (isCooling) return;
        const currentY = e.touches[0]?.clientY || 0;
        const dy = touchStartY - currentY; // >0 means swipe up -> next
        const TH = 24; // px threshold to validate a step
        if (Math.abs(dy) > TH) {
          const goingNext = dy > 0;
          // Let natural scroll out if at edges
          if (
            (goingNext && swiper.isEnd) ||
            (!goingNext && swiper.isBeginning)
          ) {
            return; // don't preventDefault -> allow exit
          }
          e.preventDefault();
          if (goingNext) swiper.slideNext();
          else swiper.slidePrev();
          isCooling = true;
          setTimeout(() => (isCooling = false), COOLDOWN);
          touchStartY = currentY; // allow chained steps
        }
      };

      target.addEventListener("wheel", wheelHandler, { passive: false });
      target.addEventListener("touchstart", touchStartHandler, {
        passive: true,
      });
      target.addEventListener("touchmove", touchMoveHandler, {
        passive: false,
      });

      detachHandlers = () => {
        target.removeEventListener("wheel", wheelHandler as any);
        target.removeEventListener("touchstart", touchStartHandler as any);
        target.removeEventListener("touchmove", touchMoveHandler as any);
      };
    };

    etapesScrollTrigger = ScrollTrigger.create({
      trigger: etapesSection,
      start: "top top",
      end: "bottom top",
      pin: true,
      anticipatePin: 1,
      // markers: true,
      onEnter: attachScrollHandlers,
      onEnterBack: attachScrollHandlers,
      onLeave: () => detachHandlers(),
      onLeaveBack: () => detachHandlers(),
      onToggle: (self) => {
        // we set header visibility state elsewhere once ref available
        isHeaderHidden.value = self.isActive;
      },
    });

    // Nombre total de slides (pour la synchro de progression)
    totalEtapesSlides =
      etapesSection.querySelectorAll(".etapes swiper-slide").length || 0;

    // Option : démarrer avec progress = 0 aligné sur la première slide
    // (Si besoin future logique ici)
  }

  // Lancer le préchargement tout à la fin du montage pour ne pas bloquer les animations initiales
  preloadEtapesImages();
});

// Cleanup when leaving the home page to avoid leaking header hidden state or active triggers
onBeforeUnmount(() => {
  try {
    if (etapesScrollTrigger) {
      etapesScrollTrigger.kill();
      etapesScrollTrigger = null;
    }
  } catch {}
  // Always show header again when leaving this page
  isHeaderHidden.value = false;
});

// Partenaires
const {
  data: partners,
  pending,
  error,
} = await useAsyncData("partners", async () => {
  const data = await queryCollection("partners").all();
  return flattenMeta(data);
});

// Tags from content/notre_agence/tags.json
const { data: allTags } = await useAsyncData<ProjectTag[]>("allTags", () =>
  getAllTags()
);

// Getting all highlighted projects from content/nos_projets
const { data: highlightedProjects } = await useAsyncData(
  "highlighted_projects",
  async () => {
    const data = await queryCollection("nos_projets")
      .where("highlighted", "IS NOT NULL")
      .all();
    return flattenMeta(data);
  }
);

const currentHighlightedProject = computed(() => {
  if (!highlightedProjects.value || highlightedProjects.value.length === 0)
    return null;

  const id = selectedTag.value?.id;
  return highlightedProjects.value.find((p) => p.highlighted === id) || null;
});

const selectedTag = ref<ProjectTag | null>(allTags.value?.[0] ?? null);

function handleTagSelect(tagId: string) {
  if (!allTags.value) return;
  selectedTag.value = allTags.value.find((tag) => tag.id === tagId) ?? null;
}

// Etapes Projet
const { data: projectStepHome } = await useAsyncData(
  "projectStepHome",
  async () => {
    const data = await queryCollection("projectStepHome").all();
    return flattenMeta(data);
  }
);

// Ajout de balises <link rel="preload"> pour les images des étapes (améliore le LCP perçu sur changements de slide)
useHead(() => {
  const links: any[] = [];
  const count = projectStepHome?.value?.length || 0;
  for (let i = 1; i <= count; i++) {
    links.push({
      rel: "preload",
      as: "image",
      href: `/images/projectSteps/etape${i}.png`,
    });
  }
  projectStepHome?.value?.forEach((e: any) => {
    if (e?.img) links.push({ rel: "preload", as: "image", href: e.img });
  });
  return { link: links };
});

gsap.registerPlugin(ScrollTrigger);
const sectionProjet = ref<HTMLElement | null>(null);
const { isHeaderHidden } = useHeaderVisibility();

// Conseils
const { data: advices } = await useAsyncData("conseils", async () => {
  const data = await queryCollection("conseils").all();
  return flattenMeta(data);
});

type TruncateFn = (input: unknown, limit?: number, ellipsis?: string) => string;
const truncate = useNuxtApp().$truncate as TruncateFn;

const currentAdvice = ref(advices.value ? advices.value[0] : null); // defaults to first advice

function handleAdviceSelect(advice: any) {
  // change current advice to the selected advice
  currentAdvice.value = advice;
}

// Meta
definePageMeta({
  title: "Accueil",
});
</script>

<template>
  <section class="hero invisible">
    <div class="top">
      <div class="video-player-wrapper">
        <ScriptYouTubePlayerWithPlayButton video-id="U15KM30-ugY" />
      </div>
      <div class="text">
        <h1 class="sr-only">DriveIn Production</h1>
        <p class="h2 accroche">
          Capturons
          <span class="gold"
            >votre
            <span class="underlined underlined-gold">histoire</span></span
          >, <br />
          Captons
          <span class="blue"
            >vos <span class="underlined underlined-blue">émotions</span></span
          >.
        </p>
        <Button to="/nous_contacter" class="header-cta"
          >Prendre rendez-vous →</Button
        >
      </div>
    </div>
    <div class="scroll-down-wrapper">
      <ScrollDown to="presentation"
        >Découvrir <span class="gold">Drive-In</span></ScrollDown
      >
    </div>
  </section>

  <PresentationEquipeSection />

  <section class="partners">
    <h2>Ils nous font confiance</h2>
    <swiper-container
      ref="swiperRef"
      slides-per-view="auto"
      loop="auto"
      autoplay-delay="0"
      freemode-enabled="true"
      style="--swiper-wrapper-transition-timing-function: linear"
      speed="1500"
      class="swiper-container"
      autoplay-pause-on-mouse-enter="false"
    >
      <swiper-slide
        v-for="partner in partners"
        :key="partner._id"
        class="swiper-slide"
      >
        <p>
          <img
            :src="partner.logo"
            :alt="`Logo de ${partner.name}`"
            class="partner-logo"
          />
        </p>
      </swiper-slide>
    </swiper-container>
  </section>

  <section class="realisations container">
    <div class="controles">
      <h3>Quelques réalisations</h3>
      <p>
        Un aperçu de ce que nos précédentes collaborations ont permis
        d'accomplir.
      </p>
      <div class="tags">
        <Tag
          v-for="tag in allTags"
          :class="{
            selected: selectedTag?.id === tag.id,
          }"
          :tag="tag"
          @select="handleTagSelect"
        />
      </div>
      <p class="tagDescription">{{ selectedTag?.description }}</p>
      <Button to="/notre_agence/" :class="'discret'"
        >Voir toutes les réalisations →</Button
      >
    </div>
    <div class="realisationHomeWrapper">
      <Transition name="fade" mode="out-in">
        <RealisationHome
          v-if="currentHighlightedProject"
          :project="currentHighlightedProject"
          :key="currentHighlightedProject.id"
        />
      </Transition>
    </div>
  </section>

  <section class="etapesProjet" ref="sectionProjet">
    <h2>Créons ensemble votre vidéo</h2>
    <div class="etapes container">
      <swiper-container
        direction="vertical"
        navigation-next-el="section.etapesProjet .swiper-next"
        navigation-prev-el="section.etapesProjet .swiper-prev"
        style="height: 500px"
        @swiperslidechange="handleEtapesSlideChange"
      >
        <swiper-slide
          v-for="(etape, i) in projectStepHome"
          :key="i"
          class="etape"
          :class="`etape-${i}`"
        >
          <div class="swiperSlideContent">
            <h3 class="h2">{{ etape.title }}</h3>
            <div class="description">
              <img :src="etape.img" alt="" />
              <p class="h3">{{ etape.description }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
      <div class="swiper-nav">
        <button class="swiper-prev unstyled rotate-left" aria-label="Précédent">
          <ArrowGlow orientation="left"></ArrowGlow>
        </button>
        <button class="swiper-next unstyled rotate-right" aria-label="Suivant">
          <ArrowGlow orientation="right"></ArrowGlow>
        </button>
      </div>
    </div>
    <div class="dynamic-step-image-wrapper" aria-hidden="true">
      <Transition name="fade-step-img" mode="out-in">
        <img
          v-if="currentEtapeImageSrc"
          :key="currentEtapeImageSrc"
          :src="currentEtapeImageSrc"
          alt=""
          class="dynamic-step-image"
          decoding="async"
        />
      </Transition>
    </div>
  </section>

  <section class="advices container" id="nos-conseils">
    <div class="header">
      <h2>Nos conseils avant de lancer votre projet</h2>
      <p>
        Voici quelques points clés à connaître afin d’entamer vos démarches le
        plus sereinement possible.
      </p>
    </div>
    <div class="content">
      <Transition name="fade" mode="out-in">
        <BlocImgText
          :key="currentAdvice?.id"
          :src="currentAdvice?.img"
          :alt="currentAdvice?.question || ''"
          customClass="adviceText"
        >
          <h3>{{ currentAdvice?.question }}</h3>
          <p>
            {{ truncate(currentAdvice?.description, 250, "...") }}
            <SpecialLink :to="currentAdvice?.path" class="gold"
              >En savoir plus →</SpecialLink
            >
          </p>
        </BlocImgText>
      </Transition>
      <div class="swiper">
        <swiper-container
          ref="swiperRef"
          class="swiper-container"
          navigation-next-el="section.advices .swiper-next"
          navigation-prev-el="section.advices .swiper-prev"
          pagination-type="fraction"
          slides-per-view="4"
          slides-per-group="4"
          grid-rows="2"
          grid-fill="row"
          space-between="20"
          :breakpoints="{
            '0': { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
            '640': { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 },
            '768': { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
            '1024': { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
            '1280': { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
          }"
        >
          <swiper-slide
            v-for="advice in advices"
            :key="advice._id"
            :class="[
              'swiper-slide',
              { 'swiper-slide-current': currentAdvice?.id === advice.id },
            ]"
          >
            <div class="question">
              <button
                class="h3 unstyled"
                :id="advice.id"
                @click="() => handleAdviceSelect(advice)"
              >
                {{ advice.question }}
              </button>
            </div>
          </swiper-slide>
        </swiper-container>
        <div class="swiper-nav">
          <button
            class="swiper-prev unstyled rotate-left"
            aria-label="Précédent"
          >
            <ArrowGlow orientation="left"></ArrowGlow>
          </button>
          <button
            class="swiper-next unstyled rotate-right"
            aria-label="Suivant"
          >
            <ArrowGlow orientation="right"></ArrowGlow>
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="comments">
    <GoogleComments />
  </section>
</template>

<style lang="scss" scoped>
@use "sass:color";

section.hero {
  padding-inline: clamp(20px, 1vw, 50px);
  padding-bottom: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 100px 135px;
  height: $heroBanner-fullHeight;

  // Hack to center div
  &::before {
    content: "";
  }

  @include mediaquery($index-sectionHero-breakpoint) {
    &::after {
      content: "";
    }
  }

  .top {
    display: flex;
    justify-content: center;
    gap: 150px;
    flex-wrap: wrap;
    width: 100%;

    > * {
      min-width: 0;
      min-height: 0;
    }

    @include mediaquery($index-sectionHero-breakpoint) {
      gap: 75px;
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 50px;

      @include mediaquery($index-sectionHero-breakpoint) {
        align-items: center;
        text-align: center;
        width: 100%;
      }

      .site-logo {
        max-width: 450px;
        width: 100%;
        height: auto;
      }

      .accroche {
        font-size: clamp(20px, 7vw, 4rem);
        white-space: nowrap;
        margin-top: -20px;
      }

      .header-cta {
        font-size: clamp(14px, 4vw, 1.5rem);
      }
    }

    .video-player-wrapper {
      flex: 0 1 600px;
      width: min(600px, 100%);
      aspect-ratio: 16 / 9;
      display: block;
      border-radius: 20px;
    }
  }

  .scroll-down-wrapper {
    display: flex;

    @include mediaquery($index-sectionHero-breakpoint) {
      display: none;
    }
    @include mediaquery("tablet") {
      display: none;
    }
    @include mediaquery("mobile") {
      display: flex;
    }
  }
}

section.partners {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  margin-inline: 15px;
  margin-bottom: 230px;

  @include mediaquery("tablet", "mobile") {
    flex-direction: column;
  }

  h2 {
    flex: 0 0 auto;
  }

  swiper-container {
    flex: 1 1 auto;
    min-width: 0;
    width: 5000px;

    @include mediaquery("tablet", "mobile") {
      width: 90vw;
    }

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 15px;
      height: 100%;
      opacity: 0.5;
      z-index: -1;
      left: 0;
      background: radial-gradient(
        ellipse at 0% 50%,
        rgba($primary-color-light, 50%) 0%,
        rgba(255, 255, 255, 0) 70%
      );
    }

    swiper-slide {
      margin-inline: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: auto;
      width: auto;

      p {
        width: 100%;
        display: flex;
        justify-content: center;

        img {
          max-width: 125px;
          max-width: 250px;
          max-height: 80px;
          height: auto;
          object-fit: contain;
        }
      }
    }
  }
}

section.realisations {
  margin-top: 100px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 100px;

  @include mediaquery("tablet", "mobile") {
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }

  .controles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    max-width: 300px;

    @include mediaquery("tablet", "mobile") {
      max-width: 550px;
    }
  }

  .tags {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .tagDescription {
    margin-bottom: 20px;
    color: #666;
  }

  .button {
    margin-bottom: 30px;
  }
}

section.etapesProjet {
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-block: 100px;
  position: relative;
  margin-block: 200px;
  overflow: hidden;

  &::after {
    content: ""; // For centering element
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 40px;
    opacity: 0.5;
    z-index: 2;
  }
  &:before {
    top: 0;
    background: radial-gradient(
      ellipse at 50% 0%,
      rgba(white, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  &:after {
    bottom: 0;
    background: radial-gradient(
      ellipse at 50% 100%,
      rgba(white, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }

  h2 {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
  }

  .etapes {
    display: flex;
    flex-direction: column;
    gap: 50px;

    .etape {
      display: flex;
      align-items: center;
      padding: 5px;

      .swiperSlideContent {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        gap: 30px 100px;

        .description {
          display: flex;
          align-items: center;
          gap: 20px;
          background-color: black;
          @include glow-discret(white);
          max-width: 400px;
          padding: 15px;
          border-radius: 12px;
          height: fit-content;
        }
      }
    }
  }

  &:not(.vanillaScroll) {
    .swiper-nav {
      display: none;
    }
  }

  .dynamic-step-image-wrapper {
    position: absolute;
    bottom: -90px;
    right: -70px;
    pointer-events: none;
    z-index: 2;
    opacity: 0.4;
  }
  .dynamic-step-image {
    width: clamp(50px, 65vw, 400px);
    height: auto;
    object-fit: contain;
    user-select: none;
  }
}

section.advices {
  margin-top: 100px;
  display: flex;
  flex-wrap: wrap;
  gap: 50px;

  .header {
    flex: 1;
    min-width: 300px;

    h2 {
      margin-bottom: 20px;
    }
    p {
      max-width: 600px;
      color: #666;
    }
  }

  .content {
    max-width: 1000px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 100px;

    :deep(.adviceText .text > p) {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .swiper {
      swiper-container {
        width: 100%;

        .swiper-slide {
          button {
            background: black;
            @include glow-discret($primary-color-light);
            padding: 20px;
            margin: 5px;
            border-radius: 12px;
          }

          &.swiper-slide-current button {
            @include glow-discret($secondary-color-dark);
          }
        }

        &::part(container) {
          padding-bottom: 10px;
        }
        &::part(pagination) {
          position: absolute;
          top: 100%;
          right: 0;
          width: -moz-fit-content;
          width: fit-content;
          left: unset;
          height: fit-content;
          transform: translateY(-100%);
        }
        &::part(pagination-current) {
          color: $primary-color-light;
        }
      }

      .swiper-nav {
        margin-left: 60px;
      }
    }

    button {
      color: white;
    }
  }
}

section.comments {
  padding-block: 235px;
}

.fade-step-img-enter-active,
.fade-step-img-leave-active {
  transition: opacity 0.4s ease;
}
.fade-step-img-enter-from,
.fade-step-img-leave-to {
  opacity: 0;
}
</style>

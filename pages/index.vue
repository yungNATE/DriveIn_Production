<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { register } from "swiper/element/bundle";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

register();
let contentType: string;

// Swiper
const swiperRef = ref<HTMLElement | null>(null);

let duration = 0;
let distanceRatio = 0;
let startTimer;
const isPlaying = ref(true);
let clickable = true;

onMounted(async () => {
  const swiperEl = swiperRef.value;
  if (swiperEl) {
    if (swiperEl) {
      const { injectSwiperPaginationCurrentStyle } = await import(
        "@/utils/inject-swiper-style.js"
      );
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
});

// Partenaires
contentType = "partners";
const {
  data: partners,
  pending,
  error,
} = await useAsyncData(contentType, async () => {
  const data = await queryCollection(contentType).all();
  return flattenMeta(data);
});

// Tags from content/projects/tags.json
type ProjectTag = {
  id: string;
  title: string;
  description: string;
  type: string;
};
const { data: allTags } = await useAsyncData<ProjectTag[]>("allTags", () =>
  import("@/content/projects/tags.json").then(
    (mod) => mod.default as ProjectTag[]
  )
);

// Getting all highlighted projects
contentType = "projects";
const { data: highlightedProjects } = await useAsyncData(
  contentType,
  async () => {
    const data = await queryCollection(contentType)
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

const selectedTag = ref<ProjectTag | null>(
  allTags.value ? allTags.value[0] : null
);

function handleTagSelect(tagId: string) {
  if (!allTags.value) return;
  selectedTag.value = allTags.value.find((tag) => tag.id === tagId) ?? null;
}

// Etapes Projet
const { data: etapesProjetAccueil } = await useAsyncData(
  "etapesProjetAccueil",
  async () => {
    const data = await queryCollection("etapesProjetAccueil").all();
    return flattenMeta(data);
  }
);

gsap.registerPlugin(ScrollTrigger);
const sectionProjet = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  if (!sectionProjet.value) return;

  const slides = sectionProjet.value.querySelectorAll(".etape");

  const sectionTop = sectionProjet.value.offsetTop;
  const sectionHeight = sectionProjet.value.offsetHeight;

  // Section pinned sur la durée totale
  let waitLongerBeforeEnd = 0;
  let totalScrollLength = window.innerHeight * slides.length;

  let canScrollSwiper = false;

  let pinTrigger = ScrollTrigger.create({
    trigger: sectionProjet.value,
    start: "top top",
    end: () => `top+=${window.innerHeight * slides.length} top`,
    pin: true,
    scrub: true,
    markers: true,
    onEnter: () => {
      canScrollSwiper = true;
      // setTimeout(() => {
      //   canScrollSwiper = true;
      // }, 1000);

      // Cacher le <nav> pendant le pin
      const nav = document.querySelector("nav");
      if (nav) nav.classList.add("hidden");
      if (sectionProjet.value) {
        sectionProjet.value.addEventListener(
          "wheel",
          onWheel as EventListener,
          { passive: false }
        );
      }
    },
    onLeave: () => {
      // Réafficher le <nav> à la sortie du pin
      const nav = document.querySelector("nav");
      if (nav) nav.classList.remove("hidden");
      if (sectionProjet.value) {
        sectionProjet.value.removeEventListener(
          "wheel",
          onWheel as EventListener
        );
      }
    },
  });

  function onWheel(e: WheelEvent) {
    if (!sectionProjet.value) return;
    if (!canScrollSwiper) return;

    const swiperEl = sectionProjet.value.querySelector(
      "swiper-container"
    ) as any;

    if (!swiperEl || !swiperEl.swiper) return;
    e.preventDefault();

    const swiperInstance = swiperEl.swiper;
    const currentIndex = swiperInstance.activeIndex;
    const totalSlides = swiperInstance.slides.length;
    let isScrollingDown = e.deltaY > 0;
    let isScrollingUp = e.deltaY < 0;
    let isLastSlide = currentIndex >= totalSlides - 1;

    if (isScrollingDown) {
      swiperInstance.slideNext();
    } else if (isScrollingUp) {
      swiperInstance.slidePrev();
    }

    // Remove du pin à la dernière slide
    if (isScrollingDown && isLastSlide) {
      const sectionRect = sectionProjet.value.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const sectionBottom = sectionRect.bottom + scrollY;
      const targetScroll = sectionBottom - window.innerHeight;

      window.scrollTo({ top: targetScroll, behavior: "auto" }); // Evite le jump en fin de section
      pinTrigger.kill();
      sectionProjet.value.removeEventListener(
        "wheel",
        onWheel as EventListener
      );

      sectionProjet.value.classList.add("vanillaScroll");

      return;
    }
  }
});

// Conseils
const { data: advices } = await useAsyncData("conseils", async () => {
  const data = await queryCollection("conseils").all();
  return flattenMeta(data);
});

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
        <ScriptYouTubePlayer
          video-id="jDQtxlRUf54"
          :width="700"
          :height="400"
          class="video-player"
        ></ScriptYouTubePlayer>
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
        <Button to="/contact">Prendre rendez-vous →</Button>
      </div>
    </div>
    <div class="scroll-down-wrapper">
      <ScrollDown to="presentation"
        >Découvrir <span class="gold">Drive-In</span></ScrollDown
      >
    </div>
  </section>

  <section class="presentation" id="presentation">
    <div class="container content">
      <MembreEquipe
        src="images/profil_pics/sashaProfilPic.png"
        alt="DriveIn Production"
      >
        <h2>Par Sacha Stadtfeld</h2>
        <p>
          Je suis persuadé que la vidéo est le support de communication par
          excellence ! Dans un monde dominé par le web j'ai donc décidé de me
          former aux métiers du digital et de l'audiovisuel pour devenir
          réalisateur vidéo.
        </p>
      </MembreEquipe>
      <MembreEquipe
        src="images/profil_pics/arthurProfilPic.png"
        alt="DriveIn Production"
        customClass="blue"
      >
        <h2>Avec Arthur Roberdeau</h2>
        <p>
          Arthur passionné par la photographie et la vidéo depuis tout petit.
          Devenu photographe professionnel depuis de nombreuses années, je me
          suis spécialisé dans les photographies événementielles, afin de vous
          offrir un service unique et personnalisé.
        </p>
      </MembreEquipe>
    </div>
  </section>

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
      <Button to="/projets" :class="'discret'"
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
      >
        <swiper-slide
          v-for="(etape, i) in etapesProjetAccueil"
          :key="i"
          class="etape"
          :class="`etape-${i}`"
        >
          <h3 class="h2">{{ etape.title }}</h3>
          <div class="description">
            <img :src="etape.img" alt="" />
            <p class="h3">{{ etape.description }}</p>
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
          :customClass="undefined"
        >
          <h3>{{ currentAdvice?.question }}</h3>
          <p>{{ currentAdvice?.description }}</p>
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
            class="swiper-slide"
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
</template>

<style lang="scss" scoped>
section.hero {
  padding-inline: 50px;
  padding-block: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 100px 135px;
  height: calc(100vh - 90px);

  // Hack to center div
  &::before {
    content: "";

    @include mediaquery($index-sectionHero-breakpoint) {
      display: none;
    }
  }

  .top {
    display: flex;
    justify-content: center;
    gap: 150px;
    flex-wrap: wrap;

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
    }

    .video-player {
      max-width: 550px !important;

      height: fit-content;
      filter: drop-shadow(0 0 25px rgba($primary-color-light, 0.5));
      transition: 0.3s;
      border-radius: 20px;
      overflow: hidden;

      &:hover {
        filter: drop-shadow(0 0 25px $secondary-color-dark);
      }
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

section.presentation {
  position: relative;
  margin-block: 200px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 100%;
    opacity: 0.5;
    z-index: -1;
  }
  &:before {
    left: 0;
    background: radial-gradient(
      ellipse at 0% 50%,
      rgba($primary-color-light, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  &:after {
    right: 0;
    background: radial-gradient(
      ellipse at 100% 50%,
      rgba($secondary-color-dark, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  div.content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 30px;
  }
}

section.partners {
  display: flex;
  margin-top: 50px;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  margin-inline: 15px;
  margin-bottom: 200px;

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
      width: 75px;
      margin-inline: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: auto;

      img {
        display: block;
        width: 100%;
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
    padding-inline: 150px;
    display: flex;
    flex-direction: column;
    gap: 50px;

    .etape {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: center;
      padding: 5px;

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

  &:not(.vanillaScroll) {
    .swiper-nav {
      display: none;
    }
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

    .swiper {
      swiper-container {
        width: 100%;

        swiper-slide button {
          background: black;
          @include glow-discret($primary-color-light);
          padding: 20px;
          margin: 5px;
          border-radius: 12px;
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
</style>

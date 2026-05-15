<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { getVisibleTags, type ProjectTag } from "~~/lib/tags";
import { gsap } from "gsap";

// Swiper
const swiperRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  const swiperEl = swiperRef.value;
  if (swiperEl) {
    const { injectSwiperPaginationCurrentStyle } =
      await import("@/utils/inject-swiper-style.js");
    injectSwiperPaginationCurrentStyle(swiperEl);
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
      `<+=${HERO_DELAY}`,
    )
    .from(
      ".hero .marqueeWrapper",
      {
        y: 60,
        opacity: 0,
        duration: HERO_DURATION,
        ease: "power3.out",
      },
      // Idem, chevauchement contrôlé
      `<+=${HERO_DELAY}`,
    );

  // Force a layout/resize tick once visible so iframe-based players re-measure correctly
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
  tl.eventCallback("onComplete", () => {
    window.dispatchEvent(new Event("resize"));
  });
});

// Tags for nosProjets
const { data: allTags } = await useAsyncData<ProjectTag[]>("allTags", () =>
  getVisibleTags(),
);

// Getting all highlighted projects from content/nos-projets
const { data: highlightedProjects } = await useAsyncData(
  "highlighted_projects",
  async () => {
    const data = await queryCollection("nosProjets")
      .where("highlighted", "IS NOT NULL")
      .all();
    return flattenMeta(data);
  },
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
  },
);

// Conseils
const { data: advices } = await useAsyncData("conseils", async () => {
  const data = await queryCollection("conseils")
    .where("displayHome", "=", true)
    .all();
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
        <ModalVideoPlayer :id="`111081646`" />
      </div>
      <div class="text">
        <h1 class="sr-only">DriveIn Production</h1>
        <p class="h1 hook">
          Capturons
          <span class="gold">votre histoire</span>, <br />
          Captons
          <span class="blue">vos émotions</span>.
        </p>
        <p class="subHook">
          Drive-in, l'agence qui vous accompagne réellement.
        </p>

        <Button
          to="/nous-contacter"
          class="CTA"
          title="Nous contacter pour discuter de votre projet vidéo"
          >Prendre rendez-vous</Button
        >
      </div>
    </div>
    <div class="marqueeWrapper">
      <DriveInMarquee></DriveInMarquee>
    </div>
  </section>

  <section class="realisations container">
    <div class="main">
      <div class="controles">
        <div class="title">
          <h2>Quelques réalisations</h2>
          <p>
            Découvrez le résultat de quelques de nos précédentes collaborations.
          </p>
        </div>
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
        <!--<div class="tagWrapper">
          <p class="tagDescription">{{ selectedTag?.description }}</p>
        </div>-->
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
    </div>

    <Button
      to="/notre-agence"
      title="Découvrez nos différents projets"
      class="CTA"
      >Voir toutes nos réalisations</Button
    >
  </section>

  <section class="etapesProjet">
    <h2 class="h1">Créons ensemble votre vidéo</h2>
    <HomeProjectStepParticles id="tsparticles"> </HomeProjectStepParticles>
    <div class="etapes container">
      <div
        v-for="(etape, i) in projectStepHome"
        :key="i"
        class="etape"
        :class="`etape-${i}`"
      >
        <h3 class="h2">{{ etape.title }}</h3>
        <div class="description">
          <img :src="etape.img" alt="" />
          <p class="h3">{{ etape.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="advices" id="nos-conseils">
    <div class="header container">
      <div class="text">
        <h2>Des questions avant de lancer votre projet ?</h2>
        <p>
          Voici quelques points clés à connaître afin d’entamer vos démarches le
          plus sereinement possible.
        </p>
      </div>
      <Button
        class="desktop_AD CTA"
        to="/conseils"
        title="Notre page de conseils pour réussir votre projet vidéo"
        >Découvrir tous nos autres conseils</Button
      >
    </div>
    <div class="content">
      <div class="swiper">
        <swiper-container
          ref="swiperRef"
          class="swiper-container"
          navigation-next-el="section.advices .swiper-next"
          navigation-prev-el="section.advices .swiper-prev"
          pagination-type="fraction"
          watch-overflow="true"
          slides-per-view="1"
          slides-per-group="1"
          space-between="20"
          :breakpoints="{
            '0': { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
            '768': {
              slidesPerView: 'auto',
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
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
              <Button
                class="h3"
                :id="advice.id"
                :disableArrow="true"
                :title="`Lire le conseil : ${advice.question}`"
                @click="() => handleAdviceSelect(advice)"
              >
                {{ advice.question }}
              </Button>
            </div>
          </swiper-slide>
        </swiper-container>
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
      <div class="textWrapper container">
        <Transition name="fade" mode="out-in">
          <BlocImgText
            :key="currentAdvice?.id"
            :src="currentAdvice?.img"
            :alt="currentAdvice?.question || ''"
            customClass="adviceText "
          >
            <p>
              {{ truncate(currentAdvice?.description, 250, "...") }}
              <SpecialLink :to="currentAdvice?.path" class="gold"
                >En savoir plus</SpecialLink
              >
            </p>
          </BlocImgText>
        </Transition>
        <Button
          class="mobile_AD CTA"
          to="/conseils"
          title="Notre page de conseils pour réussir votre projet vidéo"
          >Découvrir tous nos autres conseils</Button
        >
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
  padding-bottom: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 100px 135px;
  min-height: $heroBanner-fullHeight;

  @include mediaquery($index-sectionHero-breakpoint) {
    padding-bottom: 50px;
  }

  // Hack to center div
  &::before {
    content: "";
  }

  .top {
    display: flex;
    justify-content: center;
    gap: 150px;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    height: 100%;
    padding-inline: clamp(20px, 1vw, 50px);

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

      .hook {
        white-space: nowrap;
        margin-top: -20px;
      }

      .subHook {
        font-size: clamp(1rem, 2vw, 1.2rem);
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

  .marqueeWrapper {
    min-height: 50px;
    width: 100%;
  }
}

section.partners {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-block: 230px;

  @include mediaquery("tablet", "mobile") {
    flex-direction: column;
  }

  h2 {
    flex: 0 0 auto;
  }
}

section.realisations {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 50px;

  .main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    width: 100%;

    .controles {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 20px 50px;

      @include mediaquery(1033) {
        flex-direction: column;
        align-items: center;
        text-align: center;

        .tags {
          justify-content: center;

          @include mediaquery(500) {
            flex-direction: column;

            &,
            button {
              width: 100%;
            }
          }
        }
      }

      .title {
        max-width: 350px;
      }

      .tagWrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-right: 28px;
      }

      .tags {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
    }
  }
}

section.etapesProjet {
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-block: 220px 100px;
  position: relative;
  margin-block: 250px;
  overflow: visible;

  @include mediaquery(900) {
    margin-block: 150px;
  }

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
    width: 100%;
    text-align: center;
    z-index: 9;
  }

  h3 {
    position: relative;
  }

  #tsparticles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .etapes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 50px;
    justify-content: center;
    align-items: stretch;

    .etape {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5px;
      flex: 1 1 340px;
      max-width: 650px;
      gap: 30px 100px;

      .description {
        overflow: hidden;
        position: relative;

        border: 1px solid white;
        border-radius: 12px;
        padding: 15px 30px;
        padding-right: 65px;
        max-width: 400px;

        display: flex;
        align-items: center;
        height: 100%;

        img {
          max-width: 100px;
          width: 100%;
          height: auto;
          max-height: 50%;
          object-fit: contain;
          position: absolute;
          right: 5px;
          bottom: calc(50% - 40px);
          transform: translateY(50%);
          opacity: 0.2;
        }
      }
    }
  }
}

section.advices {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;

  .mobile_AD {
    display: none;
  }
  @include mediaquery(769) {
    .mobile_AD {
      display: block;
    }
    .desktop_AD {
      display: none;
    }
  }

  .header {
    flex: 1;
    min-width: 300px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px 100px;

    h2 {
      margin-bottom: 20px;
    }
    p {
      max-width: 600px;
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 100px;

    .textWrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 50px;

      :deep(.adviceText) {
        max-width: 700px;
      }
      :deep(.adviceText .text > p) {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    }

    .swiper {
      $swiper-advice-breakpoint: 769px;

      @include mediaquery(1000) {
        width: 100%;
      }

      swiper-container {
        width: 100%;

        .swiper-slide {
          width: 100%;
          max-width: none;

          @media (min-width: $swiper-advice-breakpoint) {
            width: auto;
            max-width: 300px;
            height: auto;
          }

          .question,
          button {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          button {
            padding: 20px;
            margin: 5px;
            border-radius: 12px;
          }

          &.swiper-slide-current button {
            color: $primary-color-light;
          }
        }

        &::part(container) {
          padding-bottom: 30px;
        }
        &::part(pagination) {
          position: absolute;
          top: 100%;
          right: 10px;
          width: -moz-fit-content;
          width: fit-content;
          left: unset;
          height: fit-content;
          transform: translateY(-100%);

          @media (min-width: $swiper-advice-breakpoint) {
            display: none;
          }
        }
        &::part(pagination-current) {
          color: $primary-color-light;
        }
      }

      .swiper-nav {
        margin-left: 60px;
      }

      .swiper-button-lock {
        display: none;
      }
    }
  }
}

section.comments {
  padding-top: 200px;
  padding-bottom: 175px;
}
</style>

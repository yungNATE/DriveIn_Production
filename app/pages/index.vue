<script lang="ts" setup>
import { ref, onMounted, computed, nextTick, watch } from "vue";
import type { AccordionPanel } from "~/components/Accordion.vue";
import { getVisibleTags, type ProjectTag } from "~~/lib/tags";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

onMounted(async () => {
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

  // Enregistrer ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Animation des étapes du projet
  const etapes = document.querySelectorAll(".etape");
  etapes.forEach((etape, index) => {
    gsap.to(etape, {
      opacity: 1,
      transform: "scale(1)",
      duration: 0.6,
      ease: "power.out",
      scrollTrigger: {
        trigger: ".etapes",
        endTrigger: "section.etapesProjet",
        start: "top bottom",
        end: "top top",
        scrub: true, // Lier l'animation au scroll
        markers: false,
        onUpdate: (self) => {
          // Décaler l'apparition de chaque étape progressivement à partir
          const progress = self.progress;
          const etapesCount = etapes.length;
          const etapeProgress = (progress * etapesCount - index) * 1.2;
          gsap.set(etape, {
            opacity: Math.max(0, Math.min(1, etapeProgress)),
            transform: `scale(${Math.max(0, Math.min(1, 0.8 + etapeProgress * 0.2))})`,
          });
        },
      },
    });
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

const realisationHomeWrapper = ref<HTMLElement | null>(null);
const highlightedProjectMinHeight = ref<string>();

watch(
  currentHighlightedProject,
  async () => {
    await nextTick();

    const height = realisationHomeWrapper.value?.offsetHeight ?? 0;
    highlightedProjectMinHeight.value = height > 0 ? `${height}px` : undefined;
  },
  { immediate: true },
);

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

const advicePanels = computed<AccordionPanel[]>(() => {
  const items = (advices.value as any[]) || [];

  return items.map((advice) => ({
    header: advice.question,
    content: truncate(advice.description, 250, "..."),
  }));
});

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

      <div
        ref="realisationHomeWrapper"
        class="realisationHomeWrapper"
        :style="
          highlightedProjectMinHeight
            ? { minHeight: highlightedProjectMinHeight }
            : undefined
        "
      >
        <Transition name="highlighted-project" mode="out-in" appear>
          <RealisationHome
            v-if="currentHighlightedProject"
            :project="currentHighlightedProject"
            :key="currentHighlightedProject.path"
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
    <div class="header container">
      <h2 class="h1">Créons ensemble votre vidéo</h2>
      <p class="h3">
        De l’idée à la livraison, nous vous accompagnons à chaque étape de votre
        projet.
      </p>
    </div>
    <HomeProjectStepParticles id="tsparticles"> </HomeProjectStepParticles>
    <div class="etapes container">
      <div
        v-for="(etape, i) in projectStepHome"
        :key="i"
        class="etape"
        :class="`etape-${i}`"
      >
        <h3>{{ etape.title }}</h3>
        <div class="description">
          <img :src="etape.img" alt="" />
          <p class="h3">{{ etape.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="advices container" id="nos-conseils">
    <div class="header">
      <div class="text">
        <h2>Des questions avant de lancer votre projet ?</h2>
        <p>
          Voici quelques points clés à connaître afin d’entamer vos démarches le
          plus sereinement possible.
        </p>
      </div>
    </div>
    <div class="content">
      <Accordion
        class="adviceAccordion"
        :accordionPanels="advicePanels"
        :onlyOneOpenAtTheTime="true"
        :openFirstPanel="false"
        maxWidth="min(100%, 920px)"
      >
        <template #panel="{ index }">
          <Button
            v-if="advices?.[index]?.path"
            class="advice-link"
            :to="advices[index].path"
            :title="`Lire le conseil : ${advices[index].question}`"
          >
            En savoir plus
          </Button>
        </template>
      </Accordion>
      <Button
        class="CTA"
        to="/conseils"
        title="Notre page de conseils pour réussir votre projet vidéo"
        >Nos autres conseils</Button
      >
    </div>
  </section>

  <section class="comments">
    <GoogleComments />
  </section>
</template>

<style lang="scss" scoped>
@use "sass:color";
$sectionHero-breakpoint: 1898;

section.hero {
  padding-bottom: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 100px 135px;
  min-height: $heroBanner-fullHeight;

  @include mediaquery($sectionHero-breakpoint) {
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

    @include mediaquery($sectionHero-breakpoint) {
      gap: 75px;
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 50px;

      @include mediaquery($sectionHero-breakpoint) {
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
        margin-top: -20px;

        .gold,
        .blue {
          white-space: nowrap;
        }
      }

      .subHook {
        font-size: clamp(1rem, 2vw, 1.2rem);
      }
    }

    .video-player-wrapper {
      flex: 0 1 850px;
      // width: min(600px, 100%);
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

    .realisationHomeWrapper {
      width: 100%;
      position: relative;
      transition: min-height 220ms ease;
    }

    :deep(.highlighted-project-enter-active),
    :deep(.highlighted-project-leave-active) {
      transition:
        opacity 220ms ease,
        transform 220ms ease,
        filter 220ms ease;
      will-change: opacity, transform, filter;
    }

    :deep(.highlighted-project-enter-from),
    :deep(.highlighted-project-leave-to) {
      opacity: 0;
      transform: translateY(12px) scale(0.985);
      filter: blur(2px);
    }

    :deep(.highlighted-project-enter-to),
    :deep(.highlighted-project-leave-from) {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }

    .controles {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
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
        text-align: center;
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
        justify-content: center;
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
  padding-block: 150px;
  position: relative;
  margin-block: 250px;
  overflow: visible;
  gap: 100px;

  @include mediaquery(900) {
    margin-block: 150px;
    padding-block: 100px;
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

  .header {
    text-align: center;
    z-index: 9;
  }

  h3 {
    position: relative;
  }

  p {
    font-weight: 500;
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
    margin: auto;

    .etape {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5px;
      flex: 1 1 340px;
      max-width: 650px;
      gap: 30px 100px;
      opacity: 0;

      &:first-child {
        opacity: 1;
      }

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

  .header {
    flex: 1;
    min-width: 300px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px 100px;
    text-align: center;

    h2 {
      margin-bottom: 20px;
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;

    .adviceAccordion {
      width: 100%;
    }

    :deep(.accordion-body) {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    :deep(.accordion-body .advice-link) {
      width: fit-content;
    }
  }
}

section.comments {
  padding-top: 200px;
  padding-bottom: 175px;
}
</style>

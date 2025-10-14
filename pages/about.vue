<script setup lang="ts">
import ImgGlow from "~/components/ImgGlow.vue";
import type { AccordionPanel } from "~/components/Accordion.vue";

// Charger les panneaux d'historique via Nuxt Content, comme dans index.vue
const { data: agencyStory } = await useAsyncData("agencyStory", async () => {
  const data = await queryCollection("agencyStory").all();
  return flattenMeta(data);
});

// Mapper le contenu vers le format attendu par <Accordion /> et assurer un tableau non nul
const accordionPanels = computed<AccordionPanel[]>(() => {
  const items = (agencyStory.value as any[]) || [];
  return (
    items
      .map((i) => ({
        header: i.header,
        content: i.content,
        customHtml: i.customHtml,
        open: !!i.open,
      }))
      // Maintenir un ordre cohérent: par date si présente dans customHtml ou par chemin
      .sort((a, b) => (a.header || "").localeCompare(b.header || ""))
  );
});

// Récupération de la méthode de travail (workMethod)
const { data: workMethod } = await useAsyncData("workMethod", async () => {
  const data = await queryCollection("workMethod").all();
  return flattenMeta(data);
});

// Panels pour le swiper: chaque slide contient un seul panel d'accordéon
const workMethodOpenIndex = ref<number | null>(null);
const workMethodPanels = computed<AccordionPanel[]>(() => {
  const items = (workMethod.value as any[]) || [];
  // Tenter d'ordonner selon le numéro présent dans l'URL d'image (…-1.png, …-2.png, etc.)
  const getOrder = (it: any) => {
    const m = String(it?.img || "").match(/(\d+)(?=\.[a-z]+$)/i);
    return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
  };
  return items
    .slice()
    .sort((a, b) => getOrder(a) - getOrder(b))
    .map((i, idx) => ({
      header: i.title,
      content: i.description,
      open: workMethodOpenIndex.value === idx,
    }));
});

function onWorkMethodToggle(idx: number, isOpen: boolean) {
  workMethodOpenIndex.value = isOpen ? idx : null;
}

// Swiper control: centrer la slide active quand un panneau s'ouvre
const workMethodSwiperEl = ref<any>(null);
const getWorkMethodSwiper = () => {
  const el = workMethodSwiperEl.value as any;
  return el && el.swiper ? (el.swiper as any) : null;
};
watch(workMethodOpenIndex, (idx) => {
  if (idx == null) return;
  const swiper = getWorkMethodSwiper();
  if (swiper) {
    try {
      if (swiper.activeIndex !== idx) swiper.slideTo(idx);
    } catch (e) {
      // ignore
    }
  }
});

// Ouvrir par défaut la première slide lorsque les données sont prêtes
watch(
  () => workMethod.value,
  (val) => {
    if (
      Array.isArray(val) &&
      val.length > 0 &&
      workMethodOpenIndex.value == null
    ) {
      workMethodOpenIndex.value = 0;
    }
  },
  { immediate: true }
);

definePageMeta({ title: "À propos" });
</script>

<template>
  <h1 class="sr-only">À propos - DriveIn Production !</h1>
  <section class="hero">
    <div class="content container">
      <div class="text">
        <div class="header">
          <p class="h1">L'agence</p>
          <Button to="/contact">Nous contacter</Button>
        </div>
        <p>
          DriveIn Production est une société de création vidéo sur mesure, au
          service de celles et ceux qui veulent raconter leur histoire, marquer
          les esprits et toucher leur public.Nous accompagnons marques,
          institutions et créateurs de demain, en imaginant et réalisant des
          contenus engageants, actuels et parfaitement adaptés à vos besoins. De
          l’idée à l’écran, notre équipe met en œuvre toute son expertise et sa
          créativité pour donner vie à vos projets. Réalisateurs, cadreurs,
          monteurs et motion designers travaillent main dans la main pour
          produire des films institutionnels, vidéos corporate, publicités,
          clips musicaux, contenus pour les réseaux sociaux, captations
          d’événements… et bien plus encore.
        </p>
      </div>
      <ImgGlow
        class="photo"
        src="/images/profil_pics/sashaProfilPic.png"
        alt="À propos de DriveIn Production !"
      />
    </div>
    <div class="scroll-down-wrapper">
      <ScrollDown to="presentation"
        >Découvrir <span class="gold">Drive-In</span></ScrollDown
      >
    </div>
  </section>

  <PresentationEquipeSection />

  <section class="comments">
    <GoogleComments />
  </section>

  <section class="history">
    <div class="video">
      <ImgGlow
        class="photo"
        src="/images/profil_pics/sashaProfilPic.png"
        alt="À propos de DriveIn Production !"
      />
    </div>
    <div class="accordion">
      <h2 class="gold">L'histoire de l'agence</h2>
      <p>
        Drive-In Production, c’est l’histoire d’une envie de liberté, d’un goût
        pour la créativité et d’une vision plus humaine de la vidéo
        professionnelle. Voici notre parcours en quelques étapes.
      </p>
      <Accordion
        :accordionPanels="accordionPanels"
        :onlyOneOpenAtTheTime="true"
      />
    </div>
  </section>

  <section class="workMethod">
    <h2>Une méthode de travail bien rôdée</h2>
    <div class="work-swiper container">
      <swiper-container
        ref="workMethodSwiperEl"
        navigation-next-el="section.workMethod .swiper-next"
        navigation-prev-el="section.workMethod .swiper-prev"
        slides-per-view="auto"
        centered-slides="true"
        space-between="20"
        @swiperslidechange="
          (e: Event) => {
            const swiper = (e as CustomEvent).detail?.[0];
            if (!swiper) return;
            const idx = swiper.realIndex ?? swiper.activeIndex;
            if (typeof idx === 'number') workMethodOpenIndex = idx;
          }
        "
      >
        <swiper-slide v-for="(panel, idx) in workMethodPanels" :key="idx">
          <Accordion
            :accordionPanels="[panel]"
            :onlyOneOpenAtTheTime="true"
            :openFirstPanel="false"
            @toggle="(_, isOpen) => onWorkMethodToggle(idx, isOpen)"
          />
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
</template>

<style lang="scss" scoped>
section.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: $heroBanner-fullHeight;
  padding: 50px;

  &::before {
    content: "";
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 50px;
    margin-bottom: 40px;

    .text {
      max-width: 750px;
      text-align: justify;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
    }

    .photo {
      :deep(img) {
        max-width: 600px;
        width: 100%;
        aspect-ratio: 2/1.15;
        object-fit: cover;
      }
    }
  }
}

section.history {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  margin-block: 100px;

  h2 {
    text-align: center;
  }

  .accordion {
    max-width: 350px;

    > p {
      text-align: justify;
      margin-bottom: 60px;
    }

    :deep(.custom-html) {
      .date {
        position: absolute;
        right: calc(100% + 10px);
        top: 15px;
        writing-mode: vertical-rl;
        text-orientation: upright;

        .ellipsis {
          writing-mode: horizontal-tb;
        }
      }
    }
  }

  .video {
    .photo {
      $margin: 10px;
      position: sticky;
      top: calc($margin + $header-height);
      margin-bottom: $margin;

      :deep(img) {
        max-height: 600px;
        width: 100%;
        aspect-ratio: 1.15/2;
        object-fit: cover;
      }
    }
  }
}

section.workMethod {
  background-color: black;
  padding-block: 100px;
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 75px;

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
      rgba($primary-color-light, 1) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  &:after {
    bottom: 0;
    background: radial-gradient(
      ellipse at 50% 100%,
      rgba($secondary-color-dark, 1) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
}

section.workMethod {
  h2 {
    text-align: center;
  }

  .work-swiper {
    swiper-container {
      width: 100%;

      swiper-slide {
        width: 350px;
        padding: 20px;
      }
    }

    .swiper-nav {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center; /* Centrage des flèches sous le swiper */
      gap: 40px;
    }
  }
}
</style>

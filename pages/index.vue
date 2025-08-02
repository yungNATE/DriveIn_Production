<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { register } from "swiper/element/bundle";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

register();
let contentType: string;

// Swiper
const swiperRef = ref(null);

let duration = 0;
let distanceRatio = 0;
let startTimer;
const isPlaying = ref(true);
let clickable = true;

onMounted(() => {
  const swiperEl = swiperRef.value;
  if (swiperEl) {
    // swiperEl.addEventListener("mouseenter", () => {
    //   if (isPlaying.value) {
    //     // swiper.stop();
    //     isPlaying.value = false;
    //   }
    // });
    // swiperEl.addEventListener("mouseleave", () => {
    //   // swiper.start();
    // });
  }
});

contentType = "partners";
const {
  data: partners,
  pending,
  error,
} = await useAsyncData(contentType, () => queryCollectionFlat(contentType));

// Getting tags from content/projects/tags.json
const { data: allTags } = await useAsyncData("allTags", () =>
  import("~/content/projects/tags.json").then((mod) => mod.default)
);

// Getting all highlighted projects
contentType = "projects";
const { data: highlightedProjects } = await useAsyncData(contentType, () =>
  queryCollectionFlat(contentType, (query: any) =>
    query.where("highlighted", "IS NOT NULL")
  )
);

const currentHighlightedProject = computed(() => {
  if (!selectedTagId.value || !highlightedProjects.value) return null;

  let currentHighlightedProject = highlightedProjects.value.find(
    (highlightedProjects) =>
      highlightedProjects.highlighted === selectedTagId.value
  );

  return currentHighlightedProject;
});

const selectedTagId = ref<string | null>(null);

function handleTagSelect(tagId: string) {
  selectedTagId.value = tagId;
}

// Etapes Projet
const { data: etapesProjetAccueil } = await useAsyncData(
  "etapesProjetAccueil",
  () => queryCollectionFlat("etapesProjetAccueil")
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
  // event listener scroll console log totalScrollLength
  // window.addEventListener("scroll", () => {
  //   console.log(
  //     "Total Scroll Length:",
  //     totalScrollLength,
  //     "scrollY:",
  //     window.scrollY
  //   );
  // });

  let pinTrigger = ScrollTrigger.create({
    trigger: sectionProjet.value,
    start: "top top",
    end: () => `+=${totalScrollLength}`,
    pin: true,
    scrub: true,
    onLeave: (self) => {
      // L'utilisateur a scrollé vers le bas : on fige la section à son état final
      gsap.set(sectionProjet.value, { autoAlpha: 1, y: 0 });
      self.kill(); // ← Supprime le ScrollTrigger, donc il ne rejoue pas à la remontée
    },
  });

  gsap.set(slides[0], { autoAlpha: 1, y: 0 });

  // Animation slide par slide
  slides.forEach((slide, i) => {
    const trigger = ScrollTrigger.create({
      trigger: slide,
      start: () => `top+=${window.innerHeight * i} top`,
      end: () => `top+=${window.innerHeight * (i + 1)} top`,
      scrub: true,
      onLeave: (self) => {
        // L'utilisateur a scrollé vers le bas : on fige le slide à son état final
        gsap.set(slide, { autoAlpha: 1, y: 0 });
        self.kill(); // ← Supprime le ScrollTrigger, donc il ne rejoue pas à la remontée
      },
    });

    gsap.fromTo(
      slide,
      { autoAlpha: 0, y: 100 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: trigger,
      }
    );
  });
});

// Conseils
const { data: advices } = await useAsyncData("conseils", () =>
  queryCollectionFlat("conseils")
);

const currentAdvice = ref(advices.value ? advices.value[0] : null); // defaults to first advice

function handleAdviceSelect(advice: any) {
  console.log(advice);

  // change current advice to the selected advice
  currentAdvice.value = advice;
}

// Meta
definePageMeta({
  title: "Accueil",
});
</script>

<template>
  <section class="hero">
    <div class="text">
      <h1 class="sr-only">DriveIn Production</h1>
      <img
        class="site-logo"
        src="`~/assets/icones/driveInProductionIcone.svg`"
        alt="Logo Drive-In Production"
      />
      <p class="h2 accroche">
        Capturons <span class="gold">votre histoire</span>, <br />
        Captons <span class="blue">vos émotions</span>.
      </p>
      <Button to="/contact">Prendre rendez-vous →</Button>
      <ScrollDown to="presentation"
        >Découvrir <span class="gold">Drive-In</span></ScrollDown
      >
    </div>
    <ScriptYouTubePlayer
      video-id="jDQtxlRUf54"
      :width="500"
      :height="550"
      class="video-player"
    ></ScriptYouTubePlayer>
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
        <Tag v-for="tag in allTags" :tag="tag" @select="handleTagSelect" />
      </div>
      <p class="tagDescription">Lorem ipsum</p>
      <NuxtLink to="/projets" class="button">
        Voir toutes les réalisations →
      </NuxtLink>
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

  <section ref="sectionProjet" class="etapesProjet">
    <h2>Créons ensemble votre vidéo</h2>
    <div class="etapes container">
      <div
        v-for="(etape, i) in etapesProjetAccueil"
        :key="i"
        class="etape"
        :class="`etape-${i}`"
      >
        <h3 class="h1">{{ etape.title }}</h3>
        <div class="description">
          <img :src="etape.img" alt="" />
          <p class="h3">{{ etape.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="advices container">
    <div class="header">
      <h2>Nos conseils avant de lancer votre projet</h2>
      <p>
        Voici quelques points clés à connaître afin d’entamer vos démarches le
        plus sereinement possible.
      </p>
    </div>
    <div class="content">
      <Transition name="fade" mode="out-in">
        <BlocImgText :key="currentAdvice?.id" :src="currentAdvice?.img">
          <h3>{{ currentAdvice?.question }}</h3>
          <p>{{ currentAdvice?.description }}</p>
        </BlocImgText>
      </Transition>
      <swiper-container
        ref="swiperRef"
        class="swiper-container"
        navigation="true"
        pagination="true"
        slides-per-view="4"
        slides-per-group="2"
      >
        <swiper-slide
          v-for="advice in advices"
          :key="advice._id"
          class="swiper-slide"
        >
          <div class="question">
            <button
              class="h3 unstyled-button"
              :id="advice.id"
              @click="() => handleAdviceSelect(advice)"
            >
              {{ advice.question }}
            </button>
          </div>
        </swiper-slide>
      </swiper-container>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section.hero {
  padding-inline: 50px;
  padding-block: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 100px 135px;
  min-height: 100vh;

  .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;

    .site-logo {
      max-width: 450px;
      width: 100%;
      height: auto;
    }

    .accroche {
      white-space: nowrap;
    }
  }

  .video-player {
    width: 550px !important;
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

section.presentation {
  position: relative;
  margin-bottom: 200px;

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

  h2 {
    flex: 0 0 auto;
  }

  swiper-container {
    flex: 1 1 auto;
    min-width: 0;
    width: 5000px;

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

  .controles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
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
  background: rgb(53, 0, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding-block: 100px;

  &::after {
    content: ""; // For centering element
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

      .description {
        display: flex;
        align-items: center;
        gap: 20px;
        background-color: black;
        @include glow-discret(white);
        max-width: 400px;
        padding: 15px;
        border-radius: 12px;
      }
    }
  }
}

section.advices {
  margin-top: 100px;
  display: flex;
  gap: 50px;

  .header {
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

    button {
      color: white;
    }
    .swiper {
      width: 100%;
    }
  }
}
</style>

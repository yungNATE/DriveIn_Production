<script setup>
import { register } from "swiper/element/bundle";
register();

const contentType = "partenaires";
const { data, pending, error } = await useAsyncData(contentType, () =>
  queryCollection("content").where("path", "LIKE", `/${contentType}%`).all()
);

const partenaires = computed(() => {
  if (!data.value) return {};

  const content = data.value;

  return content.map((item) => {
    return {
      ...item,
      ...item.meta, // fusionne les données de meta avec les données principales
    };
  });
});

definePageMeta({
  title: "Accueil",
});
</script>

<template>
  <section class="presentation">
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

  <section class="partenaires">
    <h2>Ils nous font confiance</h2>
    <swiper-container
      slides-per-view="auto"
      loop="auto"
      autoplay-delay="0"
      freemode-enabled="true"
      style="--swiper-wrapper-transition-timing-function: linear"
      speed="1500"
      class="swiper-container"
    >
      <swiper-slide
        v-for="partenaire in partenaires"
        :key="partenaire._id"
        class="swiper-slide"
      >
        <p>
          <img
            :src="partenaire.logo"
            :alt="`Logo de ${partenaire.name}`"
            class="partenaire-logo"
          /></p
      ></swiper-slide>
    </swiper-container>
  </section>
</template>

<style lang="scss" scoped>
section.presentation {
  position: relative;

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

section.partenaires {
  @include container;
  display: flex;
  margin-top: 50px;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;

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
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>

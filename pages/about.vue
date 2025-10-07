<script setup lang="ts">
import ImgGlow from "~/components/ImgGlow.vue";
import type { AccordionPanel } from "~/components/Accordion.vue";

// Exemple d'utilisation du nouvel accordéon interne (remplace l'ancien composant UAccordion de Nuxt UI)
const accordionPanels = ref<AccordionPanel[]>([
  {
    header: "Drive-In Production : Notre vision",
    content:
      "Nous créons des expériences vidéo sur-mesure qui racontent une histoire et engagent votre audience.",
    customHtml:
      "<ul><li>Créativité</li><li>Précision</li><li>Engagement</li></ul>",
    open: true,
  },
  {
    header: "Pourquoi choisir notre équipe ?",
    content:
      "Une équipe pluridisciplinaire capable d'accompagner un projet de A à Z, de l'écriture à la diffusion.",
    customHtml:
      "<p>Compétences : <strong>Réalisation</strong>, <strong>Motion design</strong>, <strong>Montage</strong>, <strong>Captation multi-cam</strong>.</p>",
  },
  {
    header: "Quels types de formats produisons-nous ?",
    content:
      "Films institutionnels, publicités, contenus sociaux, captations d'événements, interviews, aftermovies, clips, formats pédagogiques, etc.",
    customHtml:
      '<p>Besoin d\'un format particulier ? <a href="/contact">Parlez-nous de votre idée</a>.</p>',
  },
  {
    header: "Quels types de formats produisons-nous ?",
    content:
      "Films institutionnels, publicités, contenus sociaux, captations d'événements, interviews, aftermovies, clips, formats pédagogiques, etc.",
    customHtml:
      '<p>Besoin d\'un format particulier ? <a href="/contact">Parlez-nous de votre idée</a>.</p>',
  },
  {
    header: "Quels types de formats produisons-nous ?",
    content:
      "Films institutionnels, publicités, contenus sociaux, captations d'événements, interviews, aftermovies, clips, formats pédagogiques, etc.",
    customHtml:
      '<p>Besoin d\'un format particulier ? <a href="/contact">Parlez-nous de votre idée</a>.</p>',
  },
  {
    header: "Quels types de formats produisons-nous ?",
    content:
      "Films institutionnels, publicités, contenus sociaux, captations d'événements, interviews, aftermovies, clips, formats pédagogiques, etc.",
    customHtml:
      '<p>Besoin d\'un format particulier ? <a href="/contact">Parlez-nous de votre idée</a>.</p>',
  },
  {
    header: "Quels types de formats produisons-nous ?",
    content:
      "Films institutionnels, publicités, contenus sociaux, captations d'événements, interviews, aftermovies, clips, formats pédagogiques, etc.",
    customHtml:
      '<p>Besoin d\'un format particulier ? <a href="/contact">Parlez-nous de votre idée</a>.</p>',
  },
  {
    header: "Quels types de formats produisons-nous ?",
    content:
      "Films institutionnels, publicités, contenus sociaux, captations d'événements, interviews, aftermovies, clips, formats pédagogiques, etc.",
    customHtml:
      '<p>Besoin d\'un format particulier ? <a href="/contact">Parlez-nous de votre idée</a>.</p>',
  },
  {
    header: "Quels types de formats produisons-nous ?",
    content:
      "Films institutionnels, publicités, contenus sociaux, captations d'événements, interviews, aftermovies, clips, formats pédagogiques, etc.",
    customHtml:
      '<p>Besoin d\'un format particulier ? <a href="/contact">Parlez-nous de votre idée</a>.</p>',
  },
]);

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
          Driveln Production est une société spécialisée dans la réalisation
          vidéo sur mesure, au service des marques. des institutions et des
          créateurs de demain. De la conception à la postproduction, nous
          donnons vie à vos idées àDe la signature électronique à la remise des
          livrables numériques, tout est pensé pour réduire l'utilisation de
          papier et simplifier les échanges. travers des contenus percutants,
          engageants et parfaitement adaptés à votre public. Notre équipe réunit
          des réalisatcleurs, cadreurs, monteurs et motion designers passionnés,
          capables de répondre à tous types de projets : films institutionnels,
          vidéos corporate, publicités, clips musicaux, contenus pour les
          réseaux sociaux, captations d'événements, et bien plus encore.
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

  <section class="histoire">
    <div class="accordion">
      <Accordion
        :accordionPanels="accordionPanels"
        :onlyOnOpenAtTheTime="true"
        maxWidth="300px"
      />
    </div>
    <div class="video">
      <ImgGlow
        class="photo"
        src="/images/profil_pics/sashaProfilPic.png"
        alt="À propos de DriveIn Production !"
      />
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
  padding-top: 200px;
  padding-bottom: 50px;

  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

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

section.histoire {
  display: flex;
  justify-content: center;
  gap: 50px;

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
</style>

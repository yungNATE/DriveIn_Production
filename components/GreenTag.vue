<script lang="ts" setup>
const actions = [
  {
    title: "Partenaires locaux et déplacements optimisés",
    description:
      "Nous travaillons autant que possible avec des prestataires et talents locaux pour limiter les transports, et nous organisons nos tournages pour réduire les déplacements superflus.",
  },
  {
    title: "Matériel entretenu et durable",
    description:
      "Nous privilégions la réparation et la réutilisation du matériel plutôt que le remplacement systématique, tout en maintenant un parc à jour pour assurer la qualité.",
  },
  {
    title: "Zéro papier ou presque",
    description:
      "De la signature électronique à la remise des livrables numériques, tout est pensé pour réduire l’utilisation de papier et simplifier les échanges.",
  },
];
</script>

<template>
  <div class="greenTag">
    <h2>Une société engagé</h2>
    <div class="actions">
      <div v-for="(action, i) in actions" :key="i" class="action">
        <div>
          <img
            :src="`/assets/icones/greenTag/greenTagIcon${i + 1}.svg`"
            alt="Action icon"
          />
          <h3>{{ action.title }}</h3>
        </div>
        <p>{{ action.description }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.greenTag {
  background-color: black;
  padding-block: 100px;
  position: relative;

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
      rgba(#177353, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  &:after {
    bottom: 0;
    background: radial-gradient(
      ellipse at 50% 100%,
      rgba(#177353, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }

  h2 {
    color: #40c057;
    text-align: center;
  }
}
</style>

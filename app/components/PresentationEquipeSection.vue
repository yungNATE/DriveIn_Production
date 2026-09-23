<script setup lang="ts">
// Récupération des membres de l'équipe via Nuxt Content, triés par poids
const { data: equipe } = await useAsyncData("equipe", async () => {
  const data = await queryCollection("equipe").order("weight", "ASC").all();
  return flattenMeta(data);
});
</script>

<template>
  <section class="presentation" id="presentation">
    <div class="container content">
      <MembreEquipe
        v-for="(membre, index) in equipe"
        :key="membre.name"
        :src="membre.img"
        :alt="`${membre.name}, ${membre.role} chez DriveIn Production`"
        :customClass="index % 2 ? 'blue' : undefined"
      >
        <h2 class="h3">{{ membre.name }}</h2>
        <p class="role">{{ membre.role }}</p>
        <p>{{ membre.description }}</p>
      </MembreEquipe>
    </div>
  </section>
</template>

<style scoped lang="scss">
section.presentation {
  position: relative;
  margin-block: $space-section-md;

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
    gap: 40px;

    & > * {
      flex: 1 1 calc(25% - 40px);
      min-width: 260px;
    }

    @include mediaquery(1600) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 350px));
      justify-content: center;
      gap: 48px;
      justify-items: center;

      & > * {
        min-width: 0;
      }
    }

    @include mediaquery(850) {
      display: flex;
      flex-direction: column;
      gap: 28px;
      align-items: center;

      & > * {
        flex: 0 0 auto;
        min-width: 0;
      }
    }
  }
}
</style>

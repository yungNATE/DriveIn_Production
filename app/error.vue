<script lang="ts" setup></script>

<template>
  <section class="content">
    <h1>Cette page n'existe pas... 😓</h1>
    <div class="subTitle">
      <p>Vous vous êtes perdus ?</p>
      <Button to="/" title="">Retour à l’accueil</Button>
    </div>
    <span class="deco">404</span>
  </section>
</template>

<style lang="scss" scoped>
section.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;

  h1 {
    font-size: 4rem;
    margin: 0;
  }

  .subTitle {
    margin-top: 50px;
    text-align: center;

    p {
      margin-bottom: 40px;
    }
  }

  .deco {
    position: fixed;
    bottom: 0;
    right: 0;
    transform: translate(5%, 32%);
    font-size: 30rem;
    color: rgba(255, 255, 255, 0.1);
    z-index: -1;
    font-weight: 900;
  }
}
</style>

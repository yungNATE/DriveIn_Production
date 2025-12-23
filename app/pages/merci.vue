<template>
  <main class="merci">
    <h1>Merci !</h1>
    <p>
      Votre message a bien été envoyé. Nous vous répondrons dès que possible.
    </p>
    <p class="return">
      <SpecialLink to="/nous_contacter">Retour au formulaire</SpecialLink>
      <SpecialLink to="/">Aller à l’accueil</SpecialLink>
    </p>
  </main>
</template>

<script setup>
definePageMeta({
  title: "Merci",
  meta: [
    {
      name: "description",
      content: "Confirmation d’envoi du formulaire de contact.",
    },
  ],
});
</script>

<style scoped>
.merci {
  max-width: 720px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.return {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex: wrap;
}
</style>

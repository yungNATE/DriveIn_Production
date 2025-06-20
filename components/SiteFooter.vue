<template>
  <footer class="site-footer">
    <div class="header">
      <h2>Envie de sauter le pas ?</h2>
      <Button to="/contact">Nous contacter</Button>
    </div>
    <IconLink
      to="/"
      icon="driveInProductionIcone"
      alt="Lien vers l'accueil du site"
      target="_self"
    />
    <p>© {{ currentYear }} DriveIn Production</p>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
footer {
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  background: black;

  .header {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;
  }
}
</style>

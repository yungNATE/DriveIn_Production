<template>
  <footer class="site-footer">
    <div class="header">
      <span class="h1">Envie de sauter le pas ?</span>
      <Button to="/contact">Nous contacter</Button>
    </div>
    <p>© {{ currentYear }} DriveIn Production</p>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.site-footer {
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>

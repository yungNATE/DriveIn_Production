<template>
  <footer class="site-footer">
    <p>© {{ currentYear }} DriveIn Production</p>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.site-footer {
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>

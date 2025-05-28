<template>
  <div>
    <header class="site-header">
      <nav>
        <ul>
          <li><NuxtLink to="/">Accueil</NuxtLink></li>
          <li><NuxtLink to="/">À propos</NuxtLink></li>
          <li><NuxtLink to="/">Contact</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <p>© {{ currentYear }} DriveIn Production</p>
    </footer>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.site-header {
  background-color: #007acc;
  padding: 1rem;
  color: white;
}

.site-header ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.site-header a {
  color: white;
  text-decoration: none;
}

.site-header a:hover {
  text-decoration: underline;
}

.site-footer {
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>

<template>
  <header class="site-header">
    <nav>
      <ul>
        <li><NuxtLink to="/">Accueil</NuxtLink></li>
        <li><NuxtLink to="/">À propos</NuxtLink></li>
        <li><NuxtLink to="/">Contact</NuxtLink></li>
        <li><NuxtLink to="/projets">Projets</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

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
</style>

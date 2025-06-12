<template>
  <header>
    <nav>
      <ul>
        <li><SpecialLink to="/">Accueil</SpecialLink></li>
        <li><SpecialLink to="/about">À propos</SpecialLink></li>
        <li><SpecialLink to="/contact">Contact</SpecialLink></li>
        <li><SpecialLink to="/projets">Projets</SpecialLink></li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
header {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;

  ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }
}
</style>

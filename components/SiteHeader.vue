<template>
  <header>
    <nav>
      <div class="home-link">
        <IconLink
          to="/"
          icon="driveInProductionIcone"
          alt="Lien vers l'accueil du site"
          target="_self"
        />
      </div>
      <div class="menu-links">
        <ul class="special-links">
          <li><SpecialLink to="/">Accueil</SpecialLink></li>
          <li><SpecialLink to="/projets">Réalisations</SpecialLink></li>
        </ul>
        <Button to="/contact">Nous contacter</Button>
        <RSLinks></RSLinks>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
header {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
    flex-wrap: wrap;
  }

  .menu-links {
    display: flex;
    align-items: center;
    gap: 4rem;
    flex-wrap: wrap;
  }

  .special-links {
    list-style: none;
    display: flex;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }
}
</style>

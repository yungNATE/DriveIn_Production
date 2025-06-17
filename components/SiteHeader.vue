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
          <li><SpecialLink to="/about">L'agence</SpecialLink></li>
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
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 30px;
    background: radial-gradient(
      ellipse at 50% 0,
      $secondary-color-dark 0%,
      rgba(255, 255, 255, 0) 100%
    );
    opacity: 25%;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
    flex-wrap: wrap;
    padding: 1rem;
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

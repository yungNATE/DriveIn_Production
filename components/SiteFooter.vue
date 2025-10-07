<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer>
    <section class="comment"></section>

    <section class="upperFooter">
      <GreenTag></GreenTag>
      <ContactCTA></ContactCTA>
    </section>

    <section class="footerContent">
      <nav class="container-small">
        <ul class="footer-links classic-pages unstyled">
          <li><SpecialLink to="/">Accueil</SpecialLink></li>
          <li><SpecialLink to="/sitemap">Plan du site</SpecialLink></li>
          <li>
            <SpecialLink to="/mentions-legales">Mentions légales</SpecialLink>
          </li>
          <li>
            <SpecialLink to="/politique-de-confidentialite"
              >Politique de confidentialité</SpecialLink
            >
          </li>
        </ul>
        <ul class="footer-links special-pages unstyled">
          <li><SpecialLink to="/about">L'agence</SpecialLink></li>
          <li><SpecialLink to="/projets">Réalisations</SpecialLink></li>
          <li><SpecialLink to="/#nos-conseils">Nos conseils</SpecialLink></li>
          <li>
            <SpecialLink to="/about#processus-creatif"
              >Processus créatif</SpecialLink
            >
          </li>
        </ul>
      </nav>
      <IconLink
        to="/"
        icon="driveInProductionIcone"
        alt="Lien vers l'accueil du site"
        target="_self"
      />
      <p>© {{ currentYear }} DriveIn Production. Tous droits réservés.</p>
    </section>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  section.footerContent {
    position: relative;
    background: black;
    padding-block: 90px 110px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-inline: 20px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 40px;
      opacity: 0.5;

      top: 0;
      background: radial-gradient(
        ellipse at 50% 0%,
        rgba(white, 50%) 0%,
        rgba(255, 255, 255, 0) 70%
      );
    }

    nav {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      @include mediaquery(450) {
        flex-direction: column;
        gap: 20px;

        .footer-links {
          align-items: center !important;
        }
      }

      .footer-links {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
      }

      .special-pages {
        align-items: flex-end;
      }
    }
  }
}
</style>

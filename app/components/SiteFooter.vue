<script setup>
const currentYear = new Date().getFullYear();

// Display only on "/", "/notre-agence", "/notre-agence"
const displayGreentagPaths = ["", "notre-agence", "notre-agence"];
const route = useRoute();
const shoudlDisplayGreentag = computed(() => {
  const slug = route.path.replaceAll("/", "");
  return displayGreentagPaths.includes(slug);
});

const notDisplayContactCTAPaths = ["nous-contacter", "merci"];
const shouldDisplayContactCTA = computed(() => {
  const slug = route.path.replaceAll("/", "");
  return !notDisplayContactCTAPaths.includes(slug);
});
</script>

<template>
  <footer>
    <section class="comment"></section>

    <section class="upperFooter">
      <GreenTag v-if="shoudlDisplayGreentag"></GreenTag>
      <ContactCTA v-if="shouldDisplayContactCTA"></ContactCTA>
    </section>

    <section class="footerContent">
      <nav class="container-small">
        <ul class="footer-links classic-pages unstyled">
          <li><SpecialLink to="/">Accueil</SpecialLink></li>
          <li><SpecialLink to="/plan-du-site">Plan du site</SpecialLink></li>
          <li>
            <SpecialLink to="/">Mentions légales</SpecialLink>
          </li>
          <li>
            <SpecialLink to="/">Politique de confidentialité</SpecialLink>
          </li>
        </ul>
        <ul class="footer-links special-pages unstyled">
          <li><SpecialLink to="/notre-agence">L'agence</SpecialLink></li>
          <li><SpecialLink to="/notre-agence">Réalisations</SpecialLink></li>
          <li><SpecialLink to="/#nos-conseils">Nos conseils</SpecialLink></li>
          <li>
            <SpecialLink to="/notre-agence#processus-creatif"
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
      <p class="copyright">
        © {{ currentYear }} DriveIn Production. Tous droits réservés.
      </p>
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

    .copyright {
      text-align: center;
    }
  }
}
</style>

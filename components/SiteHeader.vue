<script setup>
import { ref, computed, watch } from "vue";
import { useHeaderVisibility } from "@/composables/useHeaderVisibility";
const menuOpen = ref(false);
const { isScrolled } = useScrollState();
const { isHeaderHidden } = useHeaderVisibility();

const iconWidth = computed(() => (isScrolled.value ? "50px" : "170px"));

// Close menu automatically if header becomes hidden (avoid off-canvas lingering)
watch(isHeaderHidden, (hidden) => {
  if (hidden) menuOpen.value = false;
});
</script>

<template>
  <header :class="{ hiddenHeader: isHeaderHidden }">
    <nav>
      <IconLink
        to="/"
        icon="driveInProductionIcone"
        alt="Lien vers l'accueil du site"
        target="_self"
        :size="isScrolled ? '95px' : '170px'"
      />
      <!-- Burger icon visible en mobile -->
      <button
        class="burger"
        @click="menuOpen = !menuOpen"
        aria-label="Ouvrir le menu"
      >
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
      <div class="menu-links" :class="{ open: menuOpen }">
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
  position: fixed;
  width: 100%;
  z-index: 99;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.4);
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;

  &.hiddenHeader {
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
  }

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 30px;
    background: radial-gradient(
      ellipse at 50% 0,
      rgba($secondary-color-dark, 50%) 0%,
      rgba(255, 255, 255, 0) 50%
    );
    opacity: 25%;
    position: absolute;
    top: 100%;
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
    transition: right 0.3s;
  }

  .special-links {
    list-style: none;
    display: flex;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }

  // Burger icon styles
  .burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1001;

    span {
      display: block;
      height: 4px;
      width: 100%;
      background: $primary-color-light;
      border-radius: 2px;
      transition: all 0.3s;
      position: relative;
    }
    // Animation croix
    span.open:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }
    span.open:nth-child(2) {
      opacity: 0;
    }
    span.open:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }

  // Responsive styles
  @include mediaquery(900) {
    nav {
      gap: 1rem;
    }
    .burger {
      display: flex;
    }
    .menu-links {
      position: fixed;
      top: 0;
      left: 100%;
      width: 100%;
      height: 100vh;
      background: rgba(black, 30%);
      backdrop-filter: blur(30px);
      flex-direction: column;
      align-items: flex-start;
      gap: 75px;
      padding: 2rem 1.5rem;
      box-shadow: -2px 0 16px rgba(0, 0, 0, 0.15);
      transition: left 0.3s;
      z-index: 999;

      align-items: center;
      padding-top: 75px;

      &.open {
        left: 0;
      }
      .special-links {
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
      }
    }
  }
}
</style>

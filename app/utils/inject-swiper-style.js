export function injectSwiperPaginationCurrentStyle(swiperEl) {
  if (swiperEl && swiperEl.shadowRoot) {
    // Fonction pour ajouter l'attribut part si besoin
    const addPartAttr = () => {
      const current = swiperEl.shadowRoot.querySelector(
        ".swiper-pagination-current"
      );
      if (current && !current.hasAttribute("part")) {
        current.setAttribute("part", "pagination-current");
      }
    };

    // Ajout initial
    addPartAttr();

    // Observe les changements dans le shadowRoot pour l'ajouter dynamiquement
    const observer = new MutationObserver(() => {
      addPartAttr();
    });
    observer.observe(swiperEl.shadowRoot, { childList: true, subtree: true });
  }
}

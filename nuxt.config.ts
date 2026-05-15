// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  modules: [
    "@nuxt/fonts",
    "@nuxt/scripts",
    "@nuxt/image",
    "nuxt-easy-lightbox",
    "@nuxtjs/seo",
    "@nuxt/content",
    "nuxt-marquee",
  ],
  // Allow external image domains (Vimeo thumbnails)
  image: {
    domains: ["i.vimeocdn.com"],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("swiper-"),
    },
  },
  site: { url: "https://test--drivein-production.netlify.app/" },
  sitemap: {
    exclude: ["/merci", "/404", "/500", "/admin/**"],
    zeroRuntime: true,
  },
  ssr: true,
  nitro: {
    preset: "static",
  },
  runtimeConfig: {
    public: {
      particles: {
        mode: "basic",
        lazy: true,
      },
    },
  },
  css: [
    "@/assets/scss/main.scss",
    // "@assets/scss/variables.scss",
    // "@assets/scss/typography.css",
  ],
  fonts: {
    defaults: {
      weights: [400, 900],
      styles: ["normal"],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },
});

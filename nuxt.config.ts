// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxt/fonts"],
  ssr: true,
  nitro: {
    preset: "static",
  },
  css: [
    "@/assets/scss/main.scss",
    // "@assets/scss/variables.scss",
    // "@assets/scss/typography.css",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },
  fonts: {
    families: [
      // Sanchez-Niu
      {
        name: "Sanchez-Niu",
        src: "/fonts/sanchez-niu/sanchez-niu.otf",
        weight: "400",
        style: "normal",
        provider: "local",
      },
      {
        name: "Sanchez-Niu",
        src: "/fonts/sanchez-niu/sanchez-niu-it.otf",
        weight: "400",
        style: "italic",
        provider: "local",
      },
      {
        name: "Sanchez-Niu",
        src: "/fonts/sanchez-niu/sanchez-niu-bold.otf",
        weight: "700",
        style: "normal",
        provider: "local",
      },
      {
        name: "Sanchez-Niu",
        src: "/fonts/sanchez-niu/sanchez-niu-bold-it.otf",
        weight: "700",
        style: "italic",
        provider: "local",
      },

      // Work Sans — fonts variables (poids variables)
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-VariableFont_wght.ttf",
        weight: "100 900",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Italic-VariableFont_wght.ttf",
        weight: "100 900",
        style: "italic",
        provider: "local",
      },

      // Work Sans — fallback statiques normal
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Thin.ttf",
        weight: "100",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-ExtraLight.ttf",
        weight: "200",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Light.ttf",
        weight: "300",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Regular.ttf",
        weight: "400",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Medium.ttf",
        weight: "500",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-SemiBold.ttf",
        weight: "600",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Bold.ttf",
        weight: "700",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-ExtraBold.ttf",
        weight: "800",
        style: "normal",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Black.ttf",
        weight: "900",
        style: "normal",
        provider: "local",
      },

      // Work Sans — fallback statiques italic
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-ThinItalic.ttf",
        weight: "100",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-ExtraLightItalic.ttf",
        weight: "200",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-LightItalic.ttf",
        weight: "300",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-Italic.ttf",
        weight: "400",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-MediumItalic.ttf",
        weight: "500",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-SemiBoldItalic.ttf",
        weight: "600",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-BoldItalic.ttf",
        weight: "700",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-ExtraBoldItalic.ttf",
        weight: "800",
        style: "italic",
        provider: "local",
      },
      {
        name: "Work Sans",
        src: "/fonts/work-sans/WorkSans-BlackItalic.ttf",
        weight: "900",
        style: "italic",
        provider: "local",
      },
    ],
  },
});

import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      source: "projects/*.md",
      type: "data",
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        presentation: z.string(),
        highlighted: z.string().optional(),
      }),
    }),
    partners: defineCollection({
      source: "partners/*.md",
      type: "data",
      schema: z.object({
        name: z.string(),
        logo: z.string(),
        description: z.string(),
      }),
    }),
    etapesProjetAccueil: defineCollection({
      source: "etapesProjetAccueil/*.md",
      type: "data",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        img: z.string(),
      }),
    }),
  },
});

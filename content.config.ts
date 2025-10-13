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
    projectStepHome: defineCollection({
      source: "projectStepHome/*.md",
      type: "data",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        img: z.string(),
        bg: z.string(),
      }),
    }),
    conseils: defineCollection({
      source: "conseils/*.md",
      type: "data",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        img: z.string(),
      }),
    }),
    googleComments: defineCollection({
      source: "googleComments/*.md",
      type: "data",
      schema: z.object({
        author: z.string(),
        comment: z.string(),
        rating: z.number().int().min(0).max(5),
      }),
    }),
    agencyStory: defineCollection({
      source: "agencyStory/*.md",
      type: "data",
      schema: z.object({
        header: z.string(),
        content: z.string(),
        customHtml: z.string().optional(),
      }),
    }),
    workMethod: defineCollection({
      source: "workMethod/*.md",
      type: "data",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        img: z.string(),
      }),
    }),
  },
});

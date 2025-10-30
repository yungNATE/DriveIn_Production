import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    nos_projets: defineCollection({
      // Source folder actually named 'nos_projets' in content/
      source: "nos_projets/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        presentation: z.string(),
        cover: z.string(),
        video: z.string(),
        otherFormats: z.array(z.string()).optional(),
        photos: z.array(z.string()),
        partner: z.array(z.string()),
        highlighted: z.string().optional(),
        tagIDs: z.array(z.string()),
        weight: z.number().int(),
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
      type: "page",
      schema: z.object({
        question: z.string(),
        description: z.string().optional(),
        img: z.string().optional(),
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
    theyChoseUs: defineCollection({
      source: "theyChoseUs/*.md",
      type: "data",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        video: z.string(),
        personneInterviewee: z.string(),
        titrePersonneInterviewee: z.string(),
      }),
    }),
  },
});

// Shared tags utilities for projects
// Provides a single source to load and type tags from content/projects/tags.json

export type ProjectTag = {
  id: string;
  title: string;
  description: string;
  type: string;
  hidden: boolean; // required by <Tag /> component
};

/**
 * Load all tags from content/projects/tags.json and ensure `hidden` exists.
 * Works in both server and client via dynamic import handled by Vite/Nuxt.
 */
export async function getAllTags(): Promise<ProjectTag[]> {
  const mod: any = await import("@/content/projects/tags.json");
  const raw = (mod?.default ?? []) as any[];
  return raw.map((t) => ({ hidden: false, ...t })) as ProjectTag[];
}

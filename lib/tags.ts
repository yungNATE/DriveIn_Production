// Shared tags utilities for nos_projets
// Provides a single source to load and type tags from content/nos_projets/tags.json

export type ProjectTag = {
  id: string;
  title: string;
  description: string;
  type: string;
  hidden: boolean; // required by <Tag /> component
};

/**
 * Load all tags from content/nos_projets/tags.json and ensure `hidden` exists.
 * Works in both server and client via dynamic import handled by Vite/Nuxt.
 */
export async function getAllTags(): Promise<ProjectTag[]> {
  const mod: any = await import("@/content/nos_projets/tags.json");
  const raw = (mod?.default ?? []) as any[];
  return raw.map((t) => ({ hidden: false, ...t })) as ProjectTag[];
}

/**
 * Build a fast lookup map of tags by id.
 */
export function mapTagsById(
  all: ProjectTag[] | undefined | null
): Record<string, ProjectTag> {
  const map: Record<string, ProjectTag> = {};
  for (const t of all || []) map[t.id] = t;
  return map;
}

/**
 * Get full tag objects for a given content item using its tagIDs.
 */
export function getTagsFor(
  item: { tagIDs?: string[] } | null | undefined,
  tagsById: Record<string, ProjectTag>
): ProjectTag[] {
  const ids: string[] = (item?.tagIDs as string[]) || [];
  return ids.map((id) => tagsById[id]).filter(Boolean) as ProjectTag[];
}

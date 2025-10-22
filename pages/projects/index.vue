<script lang="ts" setup>
import { getAllTags, type ProjectTag } from "@/lib/tags";

const contentType = "projects";
const {
  data: projets,
  pending,
  error,
} = await useAsyncData(contentType, async () => {
  const data = await queryCollection(contentType).all();
  return flattenMeta(data);
});

// Tri les projets par rapport à la propriété 'weight', plus le weight est gros, plus il apparaît en premier
projets.value?.sort((a, b) => (b.weight || 0) - (a.weight || 0));

// Tags (shared util)
const { data: allTags } = await useAsyncData<ProjectTag[]>("allTags", () =>
  getAllTags()
);
const FORMAT_NAME = "format";
const formatTags = computed(
  () => allTags.value?.filter((t) => t.type === FORMAT_NAME) || []
);
const THEME_NAME = "theme";
const themeTags = computed(
  () => allTags.value?.filter((t) => t.type === THEME_NAME) || []
);
const TECHNIQUE_NAME = "technique";
const techniqueTags = computed(
  () => allTags.value?.filter((t) => t.type === TECHNIQUE_NAME) || []
);

// Fast lookup map for tags by id
const tagsById = computed<Record<string, ProjectTag>>(() => {
  const map: Record<string, ProjectTag> = {};
  for (const t of allTags.value || []) map[t.id] = t;
  return map;
});

// Helper to get full tag objects for a given project item
function getTagsFor(item: any): ProjectTag[] {
  const ids: string[] = item?.tagIDs || [];
  const map = tagsById.value;
  return ids.map((id) => map[id]).filter(Boolean) as ProjectTag[];
}

// Store natural heights per cover to set container height dynamically
const coverHeights = ref<Record<string, number>>({});

function onImgLoad(src: string, e: Event) {
  const img = e.target as HTMLImageElement | null;
  if (!img) return;
  // Save natural image height; fall back handled in template
  const MAX_HEIGHT = 700;
  coverHeights.value[src] = Math.min(
    img.naturalHeight || coverHeights.value[src] || MAX_HEIGHT,
    MAX_HEIGHT
  );
}

// ----------------------------
// Filters state & logic
// ----------------------------
// Always exactly one format selected; default to "video"
const selectedFormatId = ref<string>("video");
// Multiple selections allowed; start empty
const selectedThemeIds = ref<string[]>([]);
const selectedTechniqueIds = ref<string[]>([]);

// Handlers
function handleSelectFormat(tagId: string) {
  // Enforce exactly one selected; ignore attempts to deselect
  if (tagId && tagId !== selectedFormatId.value) {
    selectedFormatId.value = tagId;
  }
}
function handleToggleTheme(tagId: string) {
  const arr = selectedThemeIds.value;
  const idx = arr.indexOf(tagId);
  if (idx === -1) selectedThemeIds.value = [...arr, tagId];
  else selectedThemeIds.value = arr.filter((id) => id !== tagId);
}
function handleToggleTechnique(tagId: string) {
  const arr = selectedTechniqueIds.value;
  const idx = arr.indexOf(tagId);
  if (idx === -1) selectedTechniqueIds.value = [...arr, tagId];
  else selectedTechniqueIds.value = arr.filter((id) => id !== tagId);
}

// Apply filtering (AND logic):
// - project must include the selected format
// - and include all selected themes (if any)
// - and include all selected techniques (if any)
const filteredProjets = computed(() => {
  const items = projets.value || [];
  const formatId = selectedFormatId.value;
  const themeIds = selectedThemeIds.value;
  const techniqueIds = selectedTechniqueIds.value;

  return items.filter((p: any) => {
    const tags: string[] = p?.tagIDs || [];
    // Format must always match (exactly one selected)
    if (!tags.includes(formatId)) return false;

    // Union logic for theme/technique selections
    const hasTheme = themeIds.length
      ? themeIds.some((id) => tags.includes(id))
      : false;
    const hasTechnique = techniqueIds.length
      ? techniqueIds.some((id) => tags.includes(id))
      : false;

    // If no theme/technique filter selected, accept all (for the format)
    if (!themeIds.length && !techniqueIds.length) return true;

    // Otherwise accept if it matches ANY selected tag across theme OR technique
    return hasTheme || hasTechnique;
  });
});
</script>

<template>
  <div class="projets-page">
    <h1 class="sr-only">Les projets de nos clients - DriveIn Production !</h1>

    <section class="header">
      <h1>Nos réalisations</h1>
      <Button to="/contact">Prendre rendez-vous →</Button>
    </section>

    <section class="projects container">
      <section
        class="filter"
        role="region"
        aria-controls="filteredProjects"
        aria-labelledby="filtersTitle"
      >
        <h2 id="filtersTitle" class="sr-only">Filtres des projets</h2>

        <fieldset class="formatFilter">
          <legend>Format</legend>
          <ul role="group" aria-label="Choix du format du contenu">
            <li v-for="formatTag in formatTags" :data-format="FORMAT_NAME">
              <Tag
                :tag="formatTag"
                class="filterable"
                :class="{ selected: selectedFormatId === formatTag.id }"
                @select="handleSelectFormat"
              />
            </li>
          </ul>
        </fieldset>

        <fieldset class="themeFilter">
          <legend>Thématique</legend>
          <ul role="group" aria-label="Choix de la thématique du contenu">
            <li v-for="themeTag in themeTags" :data-format="THEME_NAME">
              <Tag
                :tag="themeTag"
                class="filterable"
                :class="{ selected: selectedThemeIds.includes(themeTag.id) }"
                @select="handleToggleTheme"
              />
            </li>
          </ul>
        </fieldset>

        <fieldset class="techniqueFilter">
          <legend>Technique</legend>
          <ul
            role="group"
            aria-label="Choix de la technique utilisée pour réaliser le contenu"
          >
            <li
              v-for="techniqueTag in techniqueTags"
              :data-format="TECHNIQUE_NAME"
            >
              <Tag
                :tag="techniqueTag"
                class="filterable"
                :class="{
                  selected: selectedTechniqueIds.includes(techniqueTag.id),
                }"
                @select="handleToggleTechnique"
              />
            </li>
          </ul>
        </fieldset>
      </section>

      <section
        id="filteredProjects"
        aria-live="polite"
        aria-labelledby="filteredProjectsTitle"
      >
        <h2 id="filteredProjectsTitle" class="sr-only">
          Résultats des projets
        </h2>
        <masonry-wall
          v-if="filteredProjets.length"
          :items="filteredProjets || []"
          :gap="30"
          :min-columns="1"
          :max-columns="3"
        >
          <template #default="{ item, index }">
            <GlowElement
              :style="{
                height: `${coverHeights[item.cover] || 700}px`,
              }"
            >
              <div class="top tags">
                <Tag
                  v-for="tag in getTagsFor(item)"
                  :key="tag.id"
                  :tag="tag"
                  class="inactive"
                />
              </div>

              <div class="middle">
                <template
                  v-for="label in [`Découvrir le projet ${item.title}`]"
                  :key="label"
                >
                  <NuxtLink
                    :to="item.path"
                    :title="label"
                    :aria-label="label"
                    class="read-more"
                  >
                    {{ label }}
                  </NuxtLink>
                </template>
                <div class="imgWrapper">
                  <NuxtImg
                    :src="item.cover"
                    :alt="`Image de couverture ${item.title}`"
                    class="projectCoverImage"
                    loading="lazy"
                    @load="onImgLoad(item.cover, $event)"
                  />
                </div>
              </div>

              <div class="bottom">
                <p class="projectTitle h2">{{ item.title }}</p>
              </div>
            </GlowElement>
          </template>
        </masonry-wall>

        <div v-else>Aucun projet ne correspond aux filtres sélectionnés.</div>
      </section>
    </section>
  </div>
</template>

<style scoped>
section.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5rem;
}

section.projects {
  display: flex;
  gap: 50px;
}

section#filteredProjects {
  flex: 1 0 auto;

  :deep(.masonry-item) {
    > div {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 25px;

      > *:not(.middle) {
        position: relative;
        z-index: 2;
      }

      .projectTitle {
        position: relative;
        bottom: -20px;
        opacity: 0;
        transition:
          bottom 0.3s ease,
          opacity 0.3s ease;
      }
      &:hover .projectTitle {
        bottom: 0;
        opacity: 1;
      }

      .tags {
        display: flex;
        gap: 10px 25px;
        flex-direction: column;
        flex-wrap: wrap;
        position: relative;
        align-content: baseline;
        top: -20px;
        opacity: 0;
        transition:
          top 0.3s ease,
          opacity 0.3s ease;
        max-height: 60%;
      }
      &:hover .tags {
        top: 0;
        opacity: 1;
      }

      .imgWrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;

        .projectCoverImage {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
          object-fit: cover;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          border-radius: 15px;
          transition:
            filter 0.3s ease,
            transform 0.5s ease;
        }
      }
      &:hover {
        .imgWrapper {
          .projectCoverImage {
            filter: brightness(0.65);
            transform: scale(1.015);
          }
        }
      }

      .read-more {
        position: static;
        font-size: 0;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
        }
      }
    }
  }
}
</style>

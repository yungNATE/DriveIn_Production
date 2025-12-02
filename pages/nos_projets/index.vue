<script lang="ts" setup>
// Meta
definePageMeta({
  title: "Nos projets",
});

import {
  getAllTags,
  mapTagsById,
  getTagsFor,
  type ProjectTag,
} from "@/lib/tags";

const contentType = "nos_projets";
const {
  data: nos_projets,
  pending,
  error,
} = await useAsyncData(contentType, async () => {
  const data = await queryCollection(contentType).all();
  return flattenMeta(data);
});

// Tri les projets par rapport à la propriété 'weight', plus le weight est gros, plus il apparaît en premier
nos_projets.value?.sort((a, b) => (b.weight || 0) - (a.weight || 0));

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
const tagsById = computed<Record<string, ProjectTag>>(() =>
  mapTagsById(allTags.value)
);

// Local wrapper to use in template without passing the map every time
const getTagsForItem = (item: any) => getTagsFor(item, tagsById.value);

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
const filteredProjects = computed(() => {
  const items = nos_projets.value || [];
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
  <div class="nos_projets-page">
    <h1 class="sr-only">Les projets de nos clients - DriveIn Production !</h1>

    <section class="header container">
      <h1>Nos réalisations</h1>
      <Button to="/nous_contacter">Prendre rendez-vous →</Button>
    </section>

    <section class="nos_projets container">
      <section
        class="filters"
        role="region"
        aria-controls="filteredProjects"
        aria-labelledby="filtersTitle"
      >
        <h2 id="filtersTitle" class="sr-only">Filtres des projets</h2>

        <fieldset class="formatFilter">
          <legend class="sr-only">Format</legend>
          <span class="filterTitle h3">Les vidéos Drive-In</span>
          <ul
            role="group"
            aria-label="Choix du format du contenu"
            class="unstyled"
          >
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
          <legend class="sr-only">Thématique</legend>
          <span class="filterTitle h3">Thématique</span>
          <ul
            role="group"
            aria-label="Choix de la thématique du contenu"
            class="unstyled"
          >
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
          <legend class="sr-only">Technique</legend>
          <span class="filterTitle h3">Technique</span>
          <ul
            role="group"
            aria-label="Choix de la technique utilisée pour réaliser le contenu"
            class="unstyled"
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
          v-if="filteredProjects.length"
          :items="filteredProjects || []"
          :gap="30"
          :min-columns="1"
          :max-columns="3"
        >
          <template #default="{ item, index }">
            <GlowElement
              class="card"
              :style="{
                height: `${coverHeights[item.cover] || 700}px`,
                '--stagger': `${index * 500}ms`,
              }"
            >
              <div class="top tags">
                <Tag
                  v-for="tag in getTagsForItem(item)"
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

    <GoogleComments></GoogleComments>
  </div>
</template>

<style scoped lang="scss">
@keyframes card-bounce-in {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.985);
  }
  55% {
    opacity: 1;
    transform: translateY(-8px) scale(1.015);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// DRY helper for card hover appearance
@mixin card-hover-state {
  .projectTitle {
    bottom: 0;
    opacity: 1;
  }

  .tags {
    top: 0;
    opacity: 1;
  }

  .imgWrapper {
    .projectCoverImage {
      filter: brightness(0.65);
      transform: scale(1.015);
    }
  }
}

section.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5rem;
  gap: 30px;
  padding-inline: clamp(20px, 1vw, 50px);
}

section.nos_projets {
  $breakpoint1: 1000;
  display: flex;
  gap: 50px;

  @include mediaquery($breakpoint1) {
    flex-direction: column;
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 30px;

    @include mediaquery($breakpoint1) {
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
    }

    fieldset {
      border-radius: 12px;
      border: none;
      background-color: black;
      padding: 32px;
      width: 410px;

      &.formatFilter {
        @include glow-discret(white);
        .filterTitle {
          color: white;
        }

        @include mediaquery($breakpoint1) {
          width: 100%;
        }

        ul {
          @include glow-discret(white);
          background-color: black;
          padding: 30px;
          border-radius: 999px;

          display: flex;
          justify-content: center;

          :deep(.tag) {
            border-radius: 999px;
            padding: 10px;

            &:not(.selected) {
              filter: none;
            }
          }
        }
      }
      &.themeFilter {
        @include glow-discret($primary-color-light);
        .filterTitle {
          color: $primary-color-light;
        }
      }
      &.techniqueFilter {
        @include glow-discret($secondary-color-dark);
        .filterTitle {
          color: $secondary-color-dark;
        }
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
      }

      .filterTitle {
        display: block;
        font-weight: bold;
        margin-bottom: 15px;
      }
    }
  }
}

section#filteredProjects {
  flex: 1 0 auto;

  :deep(.masonry-item) {
    transition: 0.3s;
    &:hover {
      transform: scale(1.03);
    }
    > div {
      &.card {
        animation: card-bounce-in-f34d0a03 500ms ease both;
        animation-delay: var(--stagger, 0ms);
        will-change: transform, opacity;
      }
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 25px;
      transition:
        transform 0.3s ease,
        filter 200ms ease,
        color 200ms ease;

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
      &:hover {
        @include card-hover-state;
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

      .imgWrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
        border-radius: 15px;

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
          transition:
            filter 0.3s ease,
            transform 0.5s ease;
        }
      }
      // Other hover transitions handled by mixin

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

@media (prefers-reduced-motion: reduce) {
  section#filteredProjects {
    :deep(.masonry-item) > div.card {
      animation: none !important;
    }
  }
}

// On touch devices (no hover available), apply hover effects by default
@media (hover: none) and (pointer: coarse) {
  section#filteredProjects {
    :deep(.masonry-item) {
      > div {
        @include card-hover-state;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { flattenMeta } from "~/utils/flattenMeta";
import {
  getAllTags,
  mapTagsById,
  getTagsFor,
  type ProjectTag,
} from "~~/lib/tags";

definePageMeta({
  title: "Nos projets",
});

const contentType = "nosProjets";
const {
  data: nosProjets,
  pending,
  error,
} = await useAsyncData(contentType, async () => {
  const data = await queryCollection(contentType).all();
  return flattenMeta(data);
});

const { $img } = useNuxtApp();

// Tri les projets par rapport à la propriété 'weight', plus le weight est gros, plus il apparaît en premier
nosProjets.value?.sort((a, b) => (b.weight || 0) - (a.weight || 0));

// Tags (shared util)
const { data: allTags } = await useAsyncData<ProjectTag[]>("allTags", () =>
  getAllTags(),
);
const visibleTags = computed(
  () => allTags.value?.filter((t) => !t.hidden) || [],
);

// Fast lookup map for tags by id
const tagsById = computed<Record<string, ProjectTag>>(() =>
  mapTagsById(allTags.value),
);

// Local wrapper to use in template without passing the map every time
const getTagsForItem = (item: any) => getTagsFor(item, tagsById.value);

// Store natural heights per cover to set container height dynamically
const MAX_COVER_HEIGHT = 700;
const coverHeights = ref<Record<string, number>>({});
const loadedCovers = ref<Record<string, boolean>>({});
const preloadingCovers = new Set<string>(); // prevent duplicate preload work client-side

// ----------------------------
// Filters state & logic
// ----------------------------

// Single selection. Initialize with first visible tag
const selectedTagId = ref<string | null>(null);

const initializeSelectedTag = () => {
  if (visibleTags.value?.length) {
    selectedTagId.value = visibleTags.value[0].id;
  }
};

// Initialize on mount or when tags load
watch(visibleTags, initializeSelectedTag, { immediate: true });

// Apply filtering: project must include the selected tag
const filteredProjects = computed(() => {
  const items = nosProjets.value || [];
  const activeTagId = selectedTagId.value;

  return items.filter((p: any) => {
    const tags: string[] = p?.tagIDs || [];
    return tags.includes(activeTagId);
  });
});

// Handlers
function handleSelectTag(tagId: string) {
  if (tagId && tagId !== selectedTagId.value) {
    selectedTagId.value = tagId;
  }
}

function updateCoverHeight(src: string, height?: number | null) {
  if (!src) return;
  if (typeof height !== "number" || Number.isNaN(height)) {
    height = coverHeights.value[src];
  }
  const safeHeight = Math.min(height || MAX_COVER_HEIGHT, MAX_COVER_HEIGHT);
  coverHeights.value = { ...coverHeights.value, [src]: safeHeight };
}

function markCoverReady(src: string, height?: number | null) {
  if (!src) return;
  updateCoverHeight(src, height);
  if (loadedCovers.value[src]) return;
  loadedCovers.value = { ...loadedCovers.value, [src]: true };
}

function preloadCover(src: string) {
  if (!import.meta.client || !src) return;
  if (loadedCovers.value[src] || preloadingCovers.has(src)) return;
  preloadingCovers.add(src);

  const resolvedSrc = typeof $img === "function" ? $img(src) : src;

  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.onload = () => {
    markCoverReady(src, img.naturalHeight);
    preloadingCovers.delete(src);
  };
  img.onerror = () => {
    preloadingCovers.delete(src);
  };
  img.src = resolvedSrc;

  if (img.complete) {
    markCoverReady(src, img.naturalHeight);
    preloadingCovers.delete(src);
  }
}

const isCoverReady = (src: string) => Boolean(loadedCovers.value[src]);

if (import.meta.client) {
  // Preload every cover from the filtered list before triggering the card animation
  watch(
    () => filteredProjects.value.map((project: any) => project.cover),
    (covers) => {
      covers.forEach((cover) => preloadCover(cover));
    },
    { immediate: true },
  );
}

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
});

function onImgLoad(src: string, e: Event) {
  const img = e.target as HTMLImageElement | null;
  if (!img) {
    markCoverReady(src);
    return;
  }
  // Save natural image height; fall back handled in template
  markCoverReady(src, img.naturalHeight);
}
</script>

<template>
  <div class="nos-projets-page">
    <h1 class="sr-only">Les projets de nos clients - DriveIn Production !</h1>

    <section class="header container">
      <h1>Nos réalisations</h1>
    </section>

    <section
      class="filters"
      role="region"
      aria-controls="filteredProjects"
      aria-labelledby="filtersTitle"
    >
      <h2 id="filtersTitle" class="sr-only">Filtres des projets</h2>

      <div class="filterGroup container">
        <span class="filterTitle h3 sr-only">Filtres</span>
        <ul role="group" aria-label="Filtres du contenu" class="unstyled">
          <li v-for="tag in visibleTags" :data-format="tag.type">
            <Tag
              :tag="tag"
              class="filterable"
              :class="{ selected: selectedTagId === tag.id }"
              @select="handleSelectTag"
            />
          </li>
        </ul>
      </div>
    </section>

    <section class="nos-projets container">
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
          :column-width="300"
          :min-columns="1"
          :max-columns="3"
        >
          <template #default="{ item, index }">
            <ModalVideoPlayer
              :id="item.video"
              :title="item.title"
              :class="['card', { ready: isCoverReady(item.cover) }]"
              :style="{
                height: `${coverHeights[item.cover] || MAX_COVER_HEIGHT}px`,
                '--stagger': `${index * 500}ms`,
              }"
            >
              <div class="middle">
                <span
                  class="read-more"
                  :title="`Découvrir le projet ${item.title}`"
                  :aria-label="`Découvrir le projet ${item.title}`"
                >
                  Découvrir le projet {{ item.title }}
                </span>
                <div class="imgWrapper">
                  <NuxtImg
                    :src="item.cover"
                    :alt="`Image de couverture ${item.title}`"
                    class="projectCoverImage"
                    loading="lazy"
                    @load="onImgLoad(item.cover, $event)"
                  />
                </div>
                <div class="projectPlayButton" aria-hidden="true">
                  <PlayButton />
                </div>
              </div>

              <div class="bottom">
                <p class="projectTitle h2">{{ item.title }}</p>
              </div>
              <template #custom="{ close }">
                <p class="modalDescription">{{ item.shortDescription }}</p>

                <Button
                  v-if="item.path"
                  :to="item.path"
                  title="Voir le détail du projet"
                  @click="close"
                >
                  Voir le projet
                </Button>
              </template>
            </ModalVideoPlayer>
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
  justify-content: center;
  align-items: center;
  margin-block: 3rem 5rem;
  gap: 30px;

  @include mediaquery("mobile") {
    flex-direction: column;
    align-items: center;
  }
}

section.nos-projets {
  $breakpoint1: 1000;
  display: flex;
  gap: 50px;

  @include mediaquery($breakpoint1) {
    flex-direction: column;
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 20px;

    @include mediaquery($breakpoint1) {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 25px 35px;
    }
  }
}

.filterGroup {
  display: flex;
  flex-direction: column;
  gap: 12px;

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-bottom: 5rem;

    @include mediaquery(500) {
      flex-direction: column;

      li,
      button {
        width: 100%;
      }
    }
  }

  .filterTitle {
    display: block;
    font-weight: bold;
  }
}

section#filteredProjects {
  width: 100%;
  margin-bottom: 200px;

  :deep(.masonry-item) {
    transition: 0.3s;

    &:hover {
      transform: scale(1.03);
    }
    > div {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition:
        transform 0.3s ease,
        filter 200ms ease,
        color 200ms ease;

      &.card {
        opacity: 0;
        transform: translateY(12px) scale(0.985);
        animation: none;
        will-change: transform, opacity;
      }

      &.card.ready {
        opacity: 1;
        transform: none;
        animation: card-bounce-in 500ms ease both;
        animation-delay: var(--stagger, 0ms);

        @include mediaquery(800) {
          max-height: 300px;
        }
      }

      > *:not(.middle) {
        height: 100%;
        position: relative;
        z-index: 2;
      }

      > .middle {
        height: 0;
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
        margin-bottom: 60px;
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

      .projectPlayButton {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 0;
        transform: scale(0.88);
        transition:
          opacity 0.3s ease,
          transform 0.3s ease;
      }

      &:hover .projectPlayButton {
        opacity: 1;
        transform: scale(1);
      }
      // Other hover transitions handled by mixin

      .read-more {
        position: static;
        font-size: 0;
        background: transparent;
        border: none;
        padding: 0;
        color: inherit;
        cursor: pointer;

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

.modalDescription {
  max-width: 800px;
  padding-inline: 20px;
}

@media (prefers-reduced-motion: reduce) {
  section#filteredProjects {
    :deep(.masonry-item) > div.card.ready {
      animation: none !important;
      opacity: 1;
      transform: none;
    }
  }
}

// On touch devices (no hover available), apply hover effects by default
@media (hover: none) and (pointer: coarse) {
  section#filteredProjects {
    :deep(.masonry-item) {
      > div {
        @include card-hover-state;

        .projectPlayButton {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
  }
}
</style>

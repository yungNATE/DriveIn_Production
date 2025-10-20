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
  coverHeights.value[src] = img.naturalHeight || coverHeights.value[src] || 700;
}
</script>

<template>
  <div class="projets-page">
    <h1 class="sr-only">Les projets de nos clients - DriveIn Production !</h1>

    <section class="header">
      <h1>Nos réalisations</h1>
      <Button to="/contact">Prendre rendez-vous →</Button>
    </section>

    <section class="filter" aria-controls="filteredProjects"></section>

    <section
      id="filteredProjects"
      aria-live="polite"
      aria-labelledby="filteredProjectsTitle"
    >
      <h2 id="filteredProjectsTitle" class="sr-only">Résultats des projets</h2>
      <masonry-wall
        :items="projets || []"
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
              <NuxtImg
                :src="item.cover"
                :alt="`Image de couverture ${item.title}`"
                class="projectCoverImage"
                loading="lazy"
                @load="onImgLoad(item.cover, $event)"
              />
            </div>

            <div class="bottom">
              <p class="projectTitle h2">{{ item.title }}</p>
            </div>
          </GlowElement>
        </template>
      </masonry-wall>
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

section#filteredProjects {
  width: 70%;
  margin-left: auto;
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
        gap: 10px 10px;
        flex-direction: column;
        flex-wrap: wrap;
        position: relative;
        top: -20px;
        opacity: 0;
        transition:
          top 0.3s ease,
          opacity 0.3s ease;
        max-height: 40%;
      }
      &:hover .tags {
        top: 0;
        opacity: 1;
      }

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
        transition: filter 0.3s ease;
      }
      &:hover .projectCoverImage {
        filter: brightness(0.5);
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

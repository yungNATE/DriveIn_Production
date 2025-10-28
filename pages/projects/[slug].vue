<script lang="ts" setup>
import {
  getAllTags,
  mapTagsById,
  getTagsFor,
  type ProjectTag,
} from "@/lib/tags";

const route = useRoute();
const slug = route.params.slug as string;

const collection = "projects";
const { data: project, pending } = await useAsyncData(route.path, () => {
  return queryCollection(collection).path(`/${collection}/${slug}`).first();
});

// Load all tags once (shared key across app)
const { data: allTags } = await useAsyncData<ProjectTag[]>("allTags", () =>
  getAllTags()
);

// Build lookup map and project tags list
const tagsById = computed<Record<string, ProjectTag>>(() =>
  mapTagsById(allTags.value)
);
const projectTags = computed<ProjectTag[]>(() =>
  getTagsFor(project.value as any, tagsById.value)
);

// Lightbox state for photos gallery
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);
const lightboxImgs = computed<string[]>(() => {
  const photos = (project.value as any)?.photos as
    | Array<string | { src: string; title?: string }>
    | undefined;
  if (!photos) return [];
  // VueEasyLightbox accepts string[] or {src,title}[]
  // We pass string[] here
  return photos
    .map((p: any) => (typeof p === "string" ? p : p?.src))
    .filter(Boolean);
});

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxVisible.value = true;
};
const onLightboxHide = () => {
  lightboxVisible.value = false;
};
</script>

<template>
  <div class="content container">
    <section class="description">
      <h1>{{ project?.title }}</h1>
      <div class="tags">
        <Tag
          v-for="tag in projectTags"
          :key="tag.id"
          :tag="tag"
          class="inactive"
        />
      </div>
      <p class="h3">{{ project?.presentation }}</p>
    </section>

    <section class="media">
      <div class="mediaSection video">
        <h2 class="h3">Le film</h2>

        <GlowElement class="video">
          <ScriptYouTubePlayer
            video-id="jDQtxlRUf54"
            :width="600"
            :height="400"
            class="video-player"
          ></ScriptYouTubePlayer>
        </GlowElement>
      </div>

      <div class="mediaSection otherFormats">
        <h2 class="h3">Les formats dérivés</h2>

        <div class="videos">
          <GlowElement
            class="otherFormats"
            v-for="formatVideoID in project?.otherFormats"
          >
            <ScriptYouTubePlayer
              :video-id="formatVideoID"
              :width="600"
              :height="400"
              class="video-player"
            ></ScriptYouTubePlayer>
          </GlowElement>
        </div>
      </div>

      <div class="mediaSection photos">
        <h2 class="h3">Galerie photo</h2>

        <div class="galery">
          <GlowElement
            class="photo"
            v-for="(photoPath, idx) in project?.photos"
            :key="photoPath || idx"
            @click="() => openLightbox(idx)"
          >
            <NuxtImg
              :src="photoPath"
              :alt="
                project?.title
                  ? `Photo du tournage ${project.title}`
                  : 'Photo du tournage'
              "
              class="photo-image"
            />
          </GlowElement>
        </div>

        <!-- Lightbox (client-only) -->
        <ClientOnly>
          <VueEasyLightbox
            :visible="lightboxVisible"
            :imgs="lightboxImgs"
            :index="lightboxIndex"
            @hide="onLightboxHide"
          />
        </ClientOnly>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
div.content {
  display: flex;
  flex-wrap: wrap;
  margin-top: 150px;
  gap: 30px;

  padding-inline: 50px;
}
section.description {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 35px;
  max-width: 700px;

  position: sticky;
  top: calc(10px + $header-height);
  height: fit-content;

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 35px;
  }
}

section.media {
  flex: 2;
  max-width: 1000px;

  display: flex;
  flex-direction: column;
  gap: 100px;

  text-align: center;

  .mediaSection {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;

    &.otherFormats {
      .videos {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        justify-content: center;
      }
    }

    &.photos {
      .galery {
        width: 100%;

        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        justify-items: center;

        .photo {
          max-width: 200px;
          aspect-ratio: 1 / 1;
          cursor: pointer;

          .photo-image {
            width: 100%;
            border-radius: 10px;
          }
        }
      }
    }
  }
}

:deep(.mediaSection .glowElement) {
  width: 100%;
}
:deep(.mediaSection .glowElement.video) {
  max-width: 550px;
}
:deep(.mediaSection .glowElement.otherFormats) {
  max-width: 220px;
}
</style>

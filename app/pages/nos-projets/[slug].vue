<script lang="ts" setup>
import {
  getAllTags,
  mapTagsById,
  getTagsFor,
  type ProjectTag,
} from "~~/lib/tags";

const route = useRoute();
const slug = route.params.slug as string;

const collection = "nosProjets";
const collectionPath = "nos-projets";
const { data: project, pending } = await useAsyncData(route.path, () => {
  return queryCollection(collection).path(`/${collectionPath}/${slug}`).first();
});

// Load all tags once (shared key across app)
const { data: allTags } = await useAsyncData<ProjectTag[]>("allTags", () =>
  getAllTags(),
);

// Build lookup map and project tags list
const tagsById = computed<Record<string, ProjectTag>>(() =>
  mapTagsById(allTags.value),
);
const projectTags = computed<ProjectTag[]>(() =>
  getTagsFor(project.value as any, tagsById.value),
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
      <p class="h4">{{ project?.description }}</p>
    </section>

    <section class="media">
      <div class="mediaSection video">
        <h2 class="h3">Le film</h2>

        <div class="content video">
          <ModalVideoPlayer v-if="project?.video" :id="project?.video" />
        </div>
      </div>

      <div v-if="project?.otherFormats" class="mediaSection otherFormats">
        <h2 class="h3">Les formats dérivés</h2>

        <div class="content videos">
          <div
            class="otherFormats"
            v-for="formatVideoID in project?.otherFormats"
          >
            <ModalVideoPlayer :id="formatVideoID" />
          </div>
        </div>
      </div>

      <div v-if="project?.photos" class="mediaSection photos">
        <h2 class="h3">Galerie photo</h2>

        <div class="content galery">
          <div
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
          </div>
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

  <div class="container">
    <Button to="/nos-projets" title="Tous nos projets"
      >Découvrir les autres projets</Button
    >
  </div>
</template>

<style lang="scss" scoped>
$breakpoint: 900;
div.container {
  display: flex;
  margin-top: 150px;
  gap: 100px 30px;

  padding-inline: clamp(20px, 1vw, 50px);

  @include mediaquery($breakpoint) {
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
}
section.description {
  flex: 3;

  display: flex;
  flex-direction: column;
  gap: 35px;
  max-width: 700px;

  position: sticky;
  top: calc(10px + $header-height);
  height: fit-content;

  @include mediaquery($breakpoint) {
    position: static;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 15px 25px;
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

:deep(.mediaSection .content) {
  width: 100%;
}
:deep(.mediaSection .video) {
  max-width: 550px;
}
:deep(.mediaSection .otherFormats) {
  max-width: 220px;
  @include mediaquery($breakpoint) {
    max-width: 100%;
  }
}
</style>

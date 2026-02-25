<script lang="ts" setup>
const route = useRoute();
const slug = route.params.slug as string;

const collection = "conseils";
const { data: doc } = await useAsyncData(route.path, () =>
  queryCollection(collection).path(`/${collection}/${slug}`).first(),
);

// Lightbox state for the right-side image
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);
const lightboxImgs = computed<string[]>(() => {
  const src = (doc.value as any)?.img as string | undefined;
  return src ? [src] : [];
});
const openLightbox = () => {
  if (lightboxImgs.value.length > 0) {
    lightboxIndex.value = 0;
    lightboxVisible.value = true;
  }
};
const onLightboxHide = () => {
  lightboxVisible.value = false;
};

useHead(() => ({
  titleTemplate: (titleChunk) => {
    const base = "Conseils";
    const title = (doc.value as any)?.question || titleChunk;
    return title ? `${title} • ${base}` : base;
  },
}));
</script>

<template>
  <section class="advice">
    <div class="container">
      <div v-if="doc" class="content">
        <div class="titleWrap">
          <h1 class="title">{{ doc.question }}</h1>
        </div>

        <div class="layout">
          <div class="left">
            <p class="prose h3">
              {{ doc.description }}
            </p>
          </div>

          <div class="right" v-if="doc.img">
            <div class="thumb">
              <button class="imgBtn" type="button" @click="openLightbox">
                <img :src="doc.img" :alt="doc.question || 'Conseil'" />
              </button>
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
        </div>

        <Button to="/conseils" title="Tous nos conseils"
          >Découvrir les autres conseils</Button
        >
      </div>

      <div v-else class="state">Conseil introuvable.</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section.advice {
  padding-block: 48px 72px;
  padding-inline: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 120px;
}

.titleWrap {
  text-align: center;
}

.title {
  max-width: 700px;
  margin: 0 auto;
}

.layout {
  display: flex;
  justify-content: center;
  column-gap: 120px;
}

.left {
  min-width: 0;
  flex: 3 200px;
}

.prose {
  white-space: pre-line; /* preserve line breaks in description */
  max-width: 1000px;
}

.prose :deep(p) {
  margin: 1em 0;
  line-height: 1.7;
}

.right {
  position: sticky;
  align-self: start;
  top: calc(10px + var(--header-height, 80px));
  height: fit-content;
  flex: 4;

  display: flex;
  justify-content: center;
}

.thumb {
  overflow: hidden;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
}

.imgBtn {
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  width: 100%;
}

.thumb img {
  display: block;
  width: 100%;
  height: auto;
}

.state {
  opacity: 0.7;
}

@media (max-width: 1200px) {
  .layout {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    row-gap: 70px;
  }

  .right {
    position: static;
    width: 100%;
  }
}
</style>

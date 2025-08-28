<script lang="ts" setup>
type Tag = {
  id: string;
  title: string;
  description: string;
};

const props = defineProps<{
  project: {
    slug: string;
    title: string;
    presentation: string;
    partner: string;
    path: string;
    video: string;
    tagIDs: string[]; // ← important : ce sont des strings
  };
}>();

// Tags here are only name, get tags from content/projects/tags.json and replace theme with the full tag object
const { data: allTags } = await useAsyncData<Tag[]>("tags", () =>
  import("@/content/projects/tags.json").then((mod) => mod.default)
);
const tags = computed(() => {
  const tagIds = props.project.tagIDs;
  const all = allTags.value ?? [];

  return all.filter((tag) => tagIds.includes(tag.id));
});

// Get partners description from partners content
const { data: partners } = await useAsyncData("partners-realisation", () =>
  queryCollectionFlat("partners", (query: any) =>
    query.where("name", "LIKE", props.project.partner[0])
  )
);
</script>

<template>
  <div class="realisationAccueil" :id="project.slug">
    <div class="text">
      <div class="presentation">
        <h3>
          {{ project.title }}
          <i style="color: white" v-for="partner in partners">
            Pour {{ partner.name }}
          </i>
        </h3>
        <p>{{ project.presentation }}</p>

        <SpecialLink :to="project.path">Les coulisses du projet →</SpecialLink>
      </div>
      <div class="tags">
        <Tag
          v-for="tag in tags"
          class="inactive"
          :tag="tag"
          isInactive="true"
        />
      </div>
    </div>
    <ScriptYouTubePlayer
      :video-id="project.video"
      class="video-player"
    ></ScriptYouTubePlayer>
  </div>
</template>

<style lang="scss">
.realisationAccueil {
  padding: 30px;
  border-radius: 8px;
  background: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: fit-content;
  max-width: 1000px;
  @include glow-discret($primary-color-light);
  text-align: left;

  display: flex;
  flex-wrap: wrap;
  gap: 50px;

  @include mediaquery(1400) {
    flex-direction: column;
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 50px;
    max-width: 350px;

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  .video-player {
    max-width: 500px;
    width: 100%;
  }

  // container break at 500px width
  @container (max-width: 1500px) {
    background-color: red !important;
  }
}
</style>

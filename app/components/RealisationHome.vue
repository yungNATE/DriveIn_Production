<script lang="ts" setup>
type Tag = {
  id: string;
  title: string;
  description: string;
  hidden?: boolean;
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

// Tags here are only name, get tags from content/nos-projets/tags.json and replace theme with the full tag object
const { data: allTags } = await useAsyncData<Tag[]>("tags", () =>
  import("~~/content/nos-projets/tags.json").then((mod) => mod.default)
);
const tags = computed(() => {
  const tagIds = props.project.tagIDs;
  const all = allTags.value ?? [];

  return all
    .filter((tag) => tagIds.includes(tag.id))
    .map((tag) => ({ ...tag, hidden: tag.hidden ?? false }));
});

// Get partners description from partners content
const { data: partners } = await useAsyncData(
  "partners-realisation",
  async () => {
    const data = await queryCollection("partners")
      .where("name", "LIKE", props.project.partner[0])
      .all();
    return flattenMeta(data);
  }
);

const partnersList = computed(() => partners.value ?? []);
</script>

<template>
  <div class="realisationAccueil" :id="project.slug">
    <div class="text">
      <div class="presentation">
        <h3>
          {{ project.title }}
          Pour
          <i style="color: white" v-for="partner in partnersList">
            {{ partner.name }}
          </i>
          <span v-if="partnersList.length > 1">,</span>
        </h3>
        <p>{{ project.presentation }}</p>

        <div class="tags">
          <Tag
            v-for="tag in tags"
            class="inactive"
            :tag="tag"
            isInactive="true"
          />
        </div>
      </div>

      <SpecialLink class="desktop" :to="project.path"
        >Les coulisses du projet →</SpecialLink
      >
    </div>
    <div class="video-wrapper">
      <ScriptYouTubePlayerWithPlayButton
        :video-id="project.video"
        color="white"
      />
      <SpecialLink class="mobile" :to="project.path"
        >Les coulisses du projet →</SpecialLink
      >
    </div>
  </div>
</template>

<style lang="scss">
.realisationHomeWrapper {
  width: 100%;
}

.realisationAccueil {
  padding: 30px;
  border-radius: 8px;
  background: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  @include glow-discret($primary-color-light);
  text-align: left;

  display: flex;
  gap: 50px;

  $firstBreakpoint: 1490px;

  @include mediaquery($firstBreakpoint) {
    flex-direction: column;
    padding-bottom: 50px;
  }

  .special_link {
    &.mobile {
      display: none;
      font-size: 1.5rem;
    }

    @include mediaquery($firstBreakpoint) {
      &.mobile {
        display: block;
      }
      &.desktop {
        display: none;
      }
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 50px;
    max-width: 350px;

    @include mediaquery($firstBreakpoint) {
      max-width: 100%;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  .video-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    flex: 1;

    .video-player {
      width: 100%;
    }
  }
}
</style>

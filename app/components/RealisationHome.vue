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
    partner: string[];
    path: string;
    video: string;
    tagIDs: string[]; // ← important : ce sont des strings
  };
}>();

// Tags here are only name, get tags from content/nos-projets/tags.json and replace theme with the full tag object
const { data: allTags } = await useAsyncData<Tag[]>("tags", () =>
  import("~~/content/nos-projets/tags.json").then((mod) => mod.default),
);
const tags = computed(() => {
  const tagIds = props.project.tagIDs;
  const all = allTags.value ?? [];

  return all
    .filter((tag) => tagIds.includes(tag.id))
    .map((tag) => ({ ...tag, hidden: tag.hidden ?? false }));
});

// Get partners description from partners content
const partnersKey = computed(
  () => `partners-realisation-${props.project.path}`,
);

const { data: partners } = await useAsyncData(partnersKey, async () => {
  const partnerName = props.project.partner?.[0] ?? "";
  const data = await queryCollection("partners")
    .where("name", "LIKE", partnerName)
    .all();
  return flattenMeta(data);
});

const partnersList = computed(() => partners.value ?? []);
</script>

<template>
  <div class="realisationAccueil" :id="project.slug">
    <div class="text">
      <div class="presentation">
        <h3>
          {{ project.title }}
          pour
          <i style="color: white" v-for="partner in partnersList">
            {{ partner.name }}
          </i>
          <span v-if="partnersList.length > 1">,</span>
        </h3>
        <p>{{ project.presentation }}</p>
      </div>

      <Button
        class="desktop_RH"
        :to="project.path"
        :title="`Découvrir les coulisses du projet ${project.title}`"
      >
        Les coulisses du projet
      </Button>
    </div>
    <div class="video-wrapper">
      <ModalVideoPlayer :id="project.video" />
      <Button
        class="mobile_RH"
        :to="project.path"
        :title="`Découvrir les coulisses du projet ${project.title}`"
      >
        Les coulisses du projet
      </Button>
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
  text-align: left;

  display: flex;
  flex-direction: column;
  gap: 50px;

  $firstBreakpoint: 1490px;

  @include mediaquery($firstBreakpoint) {
    flex-direction: column;
    padding-bottom: 50px;
  }

  .btn {
    &.mobile_RH {
      display: none;
      font-size: 1rem;
    }

    @include mediaquery($firstBreakpoint) {
      &.mobile_RH {
        display: block;
      }
      &.desktop_RH {
        display: none;
      }
    }
  }

  .text {
    display: flex;
    justify-content: space-between;
    gap: 50px;

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

<script lang="ts" setup>
const props = defineProps<{
  project: {
    slug: string;
    title: string;
    presentation: string;
    partner: string;
    path: string;
    video: string;
  };
}>();

// get partners description from partners content
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

        <SpecialLink :to="project.path">Les coulisses du projet</SpecialLink>
      </div>
      <div class="tags"></div>
    </div>
    <ScriptYouTubePlayer
      :video-id="project.video"
      class="video-player"
    ></ScriptYouTubePlayer>
  </div>
</template>

<style lang="scss" scoped>
.realisationAccueil {
  padding: 20px;
  border-radius: 8px;
  background: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-block: 100px;
  margin-bottom: 20px;
  width: fit-content;
  @include glow-discret($primary-color-light);
  text-align: left;

  display: flex;
}
</style>

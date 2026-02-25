<script lang="ts" setup>
import { flattenMeta } from "@/utils/flattenMeta";

const CONTENT_TYPE = "conseils";
const {
  data: advices,
  pending,
  error,
} = await useAsyncData(CONTENT_TYPE, async () => {
  const data = await queryCollection(CONTENT_TYPE).all();
  return flattenMeta(data);
});
</script>

<template>
  <section class="advices">
    <div class="container">
      <h1 class="title">Nos conseils</h1>

      <div v-if="pending" class="state">Chargement…</div>
      <div v-else-if="error" class="state error">Une erreur est survenue.</div>

      <div v-else-if="(advices?.length || 0) > 0" class="list">
        <Button
          v-for="item in advices || []"
          :key="item.path || item._path"
          :to="item.path || '#'"
          :title="`${item.question}`"
          :disable-arrow="true"
          class="card-link"
        >
          <img
            v-if="item.img"
            :src="item.img"
            :alt="item.question || 'Conseil'"
            loading="lazy"
          />
          <h2 class="card-title">{{ item.question }}</h2>
        </Button>
      </div>

      <div v-else class="state">Aucun conseil pour le moment.</div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.advices {
  padding: 48px 0 72px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

.title {
  text-align: center;
  margin-bottom: 48px;
}

.state {
  opacity: 0.7;
}
.state.error {
  color: #ff6b6b;
}

.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;

  @include mediaquery(1000) {
    flex-direction: column;
    margin: auto;
    width: fit-content;
  }

  .card-link {
    text-decoration: none;
    color: inherit;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 14px;
    max-width: 450px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 8px;
    }
  }
}

.card-title {
  font-size: 1rem;
  line-height: 1.3;
}
</style>

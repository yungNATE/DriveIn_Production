<script lang="ts" setup>
import Player from "@vimeo/player";

type VimeoOEmbedResponse = {
  thumbnail_url?: string;
  title?: string;
};

const props = withDefaults(
  defineProps<{
    id: string;
    title?: string;
    isInvisible?: boolean;
  }>(),
  {
    title: "",
    isInvisible: false,
  },
);

const slots = useSlots();
const isOpen = ref(false);
const isPlayButtonHovered = ref(false);
const hasDefaultSlot = computed(() => Boolean(slots.default));
const hasCustomSlot = computed(() => Boolean(slots.custom));
const playerFrame = ref<HTMLIFrameElement | null>(null);
const vimeoPlayer = shallowRef<Player | null>(null);

const videoId = computed(() => Number.parseInt(props.id, 10));
const oEmbedUrl = computed(
  () => `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${props.id}`,
);

const { data: oEmbed, pending: thumbnailPending } = useAsyncData(
  () => `vimeo-oembed-${props.id}`,
  () => $fetch<VimeoOEmbedResponse>(oEmbedUrl.value),
  {
    immediate: !props.isInvisible,
    watch: [() => props.id, () => props.isInvisible],
  },
);

const thumbnailUrl = computed(() => oEmbed.value?.thumbnail_url ?? "");
const modalTitle = computed(() => props.title);

const thumbnailAlt = computed(() =>
  props.title && props.title.trim()
    ? `Miniature de ${props.title}`
    : "Miniature de la vidéo",
);

const triggerLabel = computed(() =>
  props.title ? `Ouvrir la vidéo ${props.title}` : "Ouvrir la vidéo",
);

// Build a player iframe URL that ensures controls are visible.
const embedUrl = computed(() => {
  const params = new URLSearchParams({
    autoplay: "1",
    muted: "0",
    controls: "1",
    playsinline: "1",
    title: "0",
    byline: "0",
    portrait: "0",
  });
  return `https://player.vimeo.com/video/${props.id}?${params.toString()}`;
});

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}

async function initializePlayerVolume() {
  if (!playerFrame.value) return;

  vimeoPlayer.value?.destroy().catch(() => {});
  vimeoPlayer.value = new Player(playerFrame.value);

  try {
    await vimeoPlayer.value.ready();
    await vimeoPlayer.value.setVolume(0.3);
  } catch {
    // Ignore volume init failures; the player still works.
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openModal();
  }
}

watch(isOpen, async (open) => {
  if (!open) {
    vimeoPlayer.value?.destroy().catch(() => {});
    vimeoPlayer.value = null;
    return;
  }

  await nextTick();
  await initializePlayerVolume();
});

onBeforeUnmount(() => {
  vimeoPlayer.value?.destroy().catch(() => {});
  vimeoPlayer.value = null;
});
</script>

<template>
  <div class="modalVideoPlayer">
    <div
      class="modalVideoPlayerTrigger"
      :class="{ 'modalVideoPlayerTrigger--invisible': isInvisible }"
      role="button"
      tabindex="0"
      :aria-label="triggerLabel"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      @click="openModal"
      @keydown="handleTriggerKeydown"
      @mouseenter="isPlayButtonHovered = true"
      @mouseleave="isPlayButtonHovered = false"
    >
      <slot v-if="isInvisible || hasDefaultSlot" />

      <template v-else>
        <div class="modalVideoPlayerPreview" aria-hidden="true">
          <img
            v-if="thumbnailUrl"
            class="modalVideoPlayerThumbnail"
            :src="thumbnailUrl"
            :alt="thumbnailAlt"
            loading="eager"
          />

          <div
            v-else
            class="modalVideoPlayerThumbnail modalVideoPlayerThumbnail--fallback"
          >
            <span v-if="thumbnailPending" class="modalVideoPlayerLoading"
              >Chargement…</span
            >
          </div>

          <div class="modalVideoPlayerPlayButton">
            <PlayButton :is-hovered="isPlayButtonHovered" />
          </div>
        </div>
      </template>
    </div>

    <Modal v-if="isOpen" :title="modalTitle" @close="closeModal">
      <div class="modalVideoPlayerPlayer">
        <iframe
          v-if="videoId"
          ref="playerFrame"
          :src="embedUrl"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          title="Vimeo player"
        ></iframe>
      </div>

      <div v-if="hasCustomSlot" class="modalVideoPlayerCustom">
        <slot name="custom" :close="closeModal" />
      </div>
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.modalVideoPlayer {
  width: 100%;
}

.modalVideoPlayerTrigger {
  position: relative;
  display: block;
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.32);
    border-radius: 20px;
  }
}

.modalVideoPlayerPreview,
.modalVideoPlayerPlayer {
  position: relative;
  display: block;
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
}

.modalVideoPlayerCustom {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modalVideoPlayerThumbnail {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modalVideoPlayerThumbnail--fallback {
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(255, 255, 255, 0.08),
      transparent 35%
    ),
    linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(26, 26, 26, 0.95));
}

.modalVideoPlayerLoading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: white;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.modalVideoPlayerPlayButton {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.28);
  transition: background 0.2s ease;
}

.modalVideoPlayerTrigger:hover .modalVideoPlayerPlayButton {
  background: rgba(0, 0, 0, 0.38);
}

.modalVideoPlayerTrigger--invisible {
  cursor: pointer;
}

.modalVideoPlayerAwaitingLoad {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.667);
}

:deep(iframe) {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>

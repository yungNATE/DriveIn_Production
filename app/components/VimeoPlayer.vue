<script lang="ts" setup>
import Player from "@vimeo/player";

interface Props {
  /** Identifiant numérique de la vidéo Vimeo (ex: "111081646") */
  id: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** Mode "background" Vimeo : masque titre/contrôles/barre de progression */
  background?: boolean;
  controls?: boolean;
  playsinline?: boolean;
  /** Correspond au param Vimeo `title` (renommé pour ne pas entrer en conflit avec l'attribut HTML title) */
  showTitle?: boolean;
  byline?: boolean;
  portrait?: boolean;
  /** Volume initial (0 à 1), appliqué une fois le player prêt */
  volume?: number;
  /** Texte accessible pour l'iframe (attribut title HTML) */
  ariaTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  muted: true,
  loop: false,
  background: false,
  controls: true,
  playsinline: true,
  showTitle: true,
  byline: true,
  portrait: true,
  volume: undefined,
  ariaTitle: "Lecteur vidéo Vimeo",
});

const emit = defineEmits<{
  ready: [player: Player];
  play: [];
  pause: [];
  ended: [];
}>();

const playerFrame = ref<HTMLIFrameElement | null>(null);
const vimeoPlayer = shallowRef<Player | null>(null);

const numericId = computed(() => Number.parseInt(props.id, 10));

const embedUrl = computed(() => {
  const bool01 = (value: boolean) => (value ? "1" : "0");

  const params = new URLSearchParams({
    autoplay: bool01(props.autoplay),
    muted: bool01(props.muted),
    loop: bool01(props.loop),
    background: bool01(props.background),
    controls: bool01(props.controls),
    playsinline: bool01(props.playsinline),
    title: bool01(props.showTitle),
    byline: bool01(props.byline),
    portrait: bool01(props.portrait),
  });

  return `https://player.vimeo.com/video/${props.id}?${params.toString()}`;
});

async function initPlayer() {
  if (!playerFrame.value) return;

  await destroyPlayer();

  vimeoPlayer.value = new Player(playerFrame.value);

  vimeoPlayer.value.on("play", () => emit("play"));
  vimeoPlayer.value.on("pause", () => emit("pause"));
  vimeoPlayer.value.on("ended", () => emit("ended"));

  try {
    await vimeoPlayer.value.ready();

    if (props.volume !== undefined) {
      await vimeoPlayer.value.setVolume(props.volume);
    }

    emit("ready", vimeoPlayer.value);
  } catch {
    // Le player reste fonctionnel même si l'init du volume échoue
  }
}

async function destroyPlayer() {
  if (!vimeoPlayer.value) return;
  await vimeoPlayer.value.destroy().catch(() => {});
  vimeoPlayer.value = null;
}

function play() {
  return vimeoPlayer.value?.play();
}

function pause() {
  return vimeoPlayer.value?.pause();
}

function setVolume(value: number) {
  return vimeoPlayer.value?.setVolume(value);
}

// Reconstruit le player si l'id change (l'iframe recharge une nouvelle src)
watch(
  () => props.id,
  async () => {
    await nextTick();
    await initPlayer();
  },
);

onMounted(initPlayer);
onBeforeUnmount(destroyPlayer);

defineExpose({
  player: vimeoPlayer,
  play,
  pause,
  setVolume,
  destroy: destroyPlayer,
});
</script>

<template>
  <iframe
    v-if="numericId"
    ref="playerFrame"
    class="vimeoPlayer"
    :src="embedUrl"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
    :title="ariaTitle"
  ></iframe>
</template>

<style scoped lang="scss">
.vimeoPlayer {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>

<script setup lang="ts">
import { gsap } from "gsap";

interface Props {
  value: number; // current rating value
  max?: number; // max stars
  animated?: boolean; // enable animation sequence
  size?: number; // star size in px
  color?: string; // css color (currentColor fallback)
  beatScale?: number; // scale factor on beat (pulse)
  duration?: number; // durée totale (ms) de l'animation de remplissage (toutes étoiles)
}

const props = withDefaults(defineProps<Props>(), {
  max: 5,
  animated: false,
  size: 24,
  color: "currentColor",
  beatScale: 1.15,
  duration: 900, // ms total par défaut
});

const VIEWBOX_SIZE = 24; // base width/height from the SVG viewBox

// Compute fractions for each star (0..1)
const fractions = computed(() => {
  const val = Math.max(0, Math.min(props.value || 0, props.max));
  const full = Math.floor(val);
  const partial = +(val - full).toFixed(4);
  return Array.from({ length: props.max }, (_, i) => {
    if (i < full) return 1;
    if (i === full) return partial;
    return 0;
  });
});

// Refs to clip rects & svg for animation
const rectRefs: (SVGRectElement | null)[] = [];
const svgRefs: (SVGSVGElement | null)[] = [];
const played = ref(false);
let tl: gsap.core.Timeline | null = null;
// unique suffix for clipPath ids
const instanceId = Math.random().toString(36).slice(2);

function buildTimeline() {
  if (!props.animated) return;
  if (played.value) return; // play only once
  const fr = fractions.value;
  tl?.kill();
  tl = gsap.timeline({ paused: true });
  const positiveFractions = fr.filter((f) => f > 0);
  const sumFractions = positiveFractions.reduce((a, b) => a + b, 0) || 1;
  const totalMs = Math.max(50, props.duration || 0); // garde un minimum

  fr.forEach((f, i) => {
    const targetRect = rectRefs[i];
    const targetSvg = svgRefs[i];
    if (!targetRect || !targetSvg) return;
    const finalWidth = f * VIEWBOX_SIZE; // width in viewBox units to keep proportion exact
    // set initial width 0 if positive fraction
    if (f > 0) gsap.set(targetRect, { attr: { width: 0 } });
    // fill animation
    if (f > 0 && tl) {
      // Temps de remplissage proportionnel à la fraction (allocation du budget total)
      const fillMs = (f / sumFractions) * totalMs;
      const fillSec = fillMs / 1000;
      const beatOutMs = Math.min(180, fillMs * 0.35);
      const beatInMs = beatOutMs; // symétrique
      const beatOutSec = beatOutMs / 1000;
      const beatInSec = beatInMs / 1000;

      tl.to(targetRect, {
        duration: fillSec,
        attr: { width: finalWidth },
        ease: "power2.out",
      });
      tl.to(
        targetSvg,
        {
          duration: beatOutSec,
          scale: props.beatScale,
          transformOrigin: "50% 50%",
          ease: "power1.out",
        },
        ">-0.05" // léger chevauchement après la fin du fill
      ).to(targetSvg, {
        duration: beatInSec,
        scale: 1,
        ease: "power1.in",
      });
    }
  });
}

function playTimeline() {
  if (!tl) buildTimeline();
  if (tl && !played.value) {
    tl.play();
    played.value = true;
  }
}

// IntersectionObserver to trigger animation when visible
let observer: IntersectionObserver | null = null;
const rootEl = ref<HTMLElement | null>(null);

onMounted(() => {
  if (props.animated) {
    // Prepare timeline (will set initial widths)
    buildTimeline();
    nextTick(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              playTimeline();
              observer?.disconnect();
            }
          });
        },
        { threshold: [0], rootMargin: "0px 0px -20% 0px" }
      );
      if (rootEl.value) observer.observe(rootEl.value);

      // If already on-screen at mount, trigger immediately
      const rect = rootEl.value?.getBoundingClientRect();
      if (
        rect &&
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        !played.value
      ) {
        playTimeline();
        observer?.disconnect();
      }
    });
  } else {
    // If not animated, set final widths directly
    fractions.value.forEach((f, i) => {
      const r = rectRefs[i];
      if (r) r.setAttribute("width", (f * VIEWBOX_SIZE).toString());
    });
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  tl?.kill();
});

// Watch for value changes (if dynamic) - rebuild if not yet played
watch(fractions, () => {
  if (props.animated && !played.value) {
    buildTimeline();
  } else if (!props.animated) {
    fractions.value.forEach((f, i) => {
      const r = rectRefs[i];
      if (r) r.setAttribute("width", (f * VIEWBOX_SIZE).toString());
    });
  }
});
</script>

<template>
  <div
    class="stars"
    ref="rootEl"
    :class="{ animated: animated }"
    :style="{ '--star-size': size + 'px', '--star-color': color }"
  >
    <svg
      v-for="(f, i) in fractions"
      :key="i"
      class="star"
      :class="{
        full: f === 1,
        empty: f === 0,
        partial: f > 0 && f < 1,
      }"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :data-fraction="f"
      :ref="(el) => (svgRefs[i] = el as SVGSVGElement | null)"
    >
      <defs>
        <clipPath :id="`clip-${i}-${instanceId}`">
          <rect
            :ref="(el) => (rectRefs[i] = el as SVGRectElement | null)"
            x="0"
            y="0"
            :height="24"
            :width="animated ? 0 : f * VIEWBOX_SIZE"
          />
        </clipPath>
      </defs>
      <!-- outline -->
      <path
        d="M11.16 3.26c.26-.79 1.38-.79 1.64 0l1.72 5.24c.11.32.41.54.75.54h5.51c.83 0 1.18 1.06.51 1.54l-4.46 3.24a.9.9 0 0 0-.33 1.01l1.72 5.24c.26.79-.64 1.45-1.31.96l-4.46-3.24a.9.9 0 0 0-1.06 0L7.45 21.8c-.67.49-1.57-.17-1.31-.96l1.72-5.24a.9.9 0 0 0-.33-1.01L3.07 10.6c-.67-.49-.32-1.54.51-1.54h5.51c.34 0 .64-.22.75-.54l1.72-5.24Z"
        stroke="currentColor"
        stroke-width="1.2"
        fill="none"
        class="outline"
      />
      <!-- fill -->
      <path
        d="M11.16 3.26c.26-.79 1.38-.79 1.64 0l1.72 5.24c.11.32.41.54.75.54h5.51c.83 0 1.18 1.06.51 1.54l-4.46 3.24a.9.9 0 0 0-.33 1.01l1.72 5.24c.26.79-.64 1.45-1.31.96l-4.46-3.24a.9.9 0 0 0-1.06 0L7.45 21.8c-.67.49-1.57-.17-1.31-.96l1.72-5.24a.9.9 0 0 0-.33-1.01L3.07 10.6c-.67-.49-.32-1.54.51-1.54h5.51c.34 0 .64-.22.75-.54l1.72-5.24Z"
        stroke="none"
        :fill="color"
        :clip-path="`url(#clip-${i}-${instanceId})`"
        class="fillPart"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.stars {
  display: flex;
  gap: 4px;
  .star {
    width: var(--star-size);
    height: var(--star-size);
    color: var(--star-color);
    display: block;
    transition: color 0.3s;
    .fillPart {
      transition: none;
    }
  }
  // width animé via GSAP, aucune règle statique nécessaire
}
</style>

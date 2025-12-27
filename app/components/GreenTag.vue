<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

type GsapModule = typeof import("gsap");
type GsapCore = GsapModule extends { gsap: infer T }
  ? T
  : GsapModule extends { default: infer D }
    ? D
    : never;
type GsapTimeline = ReturnType<GsapCore["timeline"]>;

const actions = [
  {
    title: "Partenaires locaux et déplacements optimisés",
    description:
      "Nous travaillons autant que possible avec des prestataires et talents locaux pour limiter les transports, et nous organisons nos tournages pour réduire les déplacements superflus.",
  },
  {
    title: "Matériel entretenu et durable",
    description:
      "Nous privilégions la réparation et la réutilisation du matériel plutôt que le remplacement systématique, tout en maintenant un parc à jour pour assurer la qualité.",
  },
  {
    title: "Zéro papier ou presque",
    description:
      "De la signature électronique à la remise des livrables numériques, tout est pensé pour réduire l’utilisation de papier et simplifier les échanges.",
  },
];

const index = (i: number) => {
  return i + 1;
};

const modules = import.meta.glob<string>(
  "../assets/icones/greenTag/greenTag*.png",
  { eager: true, import: "default" }
);
const images = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((k) => modules[k] as string);

const sectionRef = ref<HTMLElement | null>(null);
const iconRefs = ref<HTMLImageElement[]>([]);

let observer: IntersectionObserver | null = null;
let timeline: GsapTimeline | null = null;
let gsapInstance: GsapCore | null = null;

const getGsapInstance = async (): Promise<GSAP> => {
  if (gsapInstance) {
    return gsapInstance;
  }

  const module = await import("gsap");
  const gsap = module.gsap ?? module.default;
  gsapInstance = gsap;

  return gsapInstance;
};

const disposeTimeline = () => {
  if (timeline) {
    timeline.kill();
    timeline = null;
  }
};

const playIconAnimations = async () => {
  const icons = iconRefs.value;
  if (!icons.length) {
    return;
  }

  const gsap = await getGsapInstance();

  disposeTimeline();
  timeline = gsap.timeline({ defaults: { ease: "power1.out" } });

  gsap.set(icons, { transformOrigin: "50% 50%" });

  const [first, second, third] = icons;

  if (first) {
    timeline
      .to(first, { yPercent: -20, duration: 0.4 })
      .to(first, { yPercent: 10, duration: 0.3, ease: "power1.inOut" })
      .to(first, { yPercent: 0, duration: 0.3 });
  }

  if (second) {
    if (first) {
      timeline.to({}, { duration: 0.5, ease: "none" });
    }

    timeline.to(second, {
      keyframes: [
        { xPercent: -6, rotation: -10, duration: 0.08 },
        { xPercent: 6, rotation: 8, duration: 0.08 },
        { xPercent: -4, rotation: -6, duration: 0.08 },
        { xPercent: 4, rotation: 6, duration: 0.08 },
        { xPercent: -2, rotation: -4, duration: 0.08 },
        { xPercent: 0, rotation: 0, duration: 0.12 },
      ],
      ease: "power1.inOut",
    });
  }

  if (third) {
    if (second || first) {
      timeline.to({}, { duration: 1, ease: "none" });
    }

    timeline
      .fromTo(
        third,
        { rotate: 0 },
        { rotate: 360, duration: 0.8, ease: "power2.out" }
      )
      .set(third, { rotate: 0 });
  }
};

onMounted(async () => {
  await nextTick();

  if (!sectionRef.value) {
    return;
  }

  observer = new IntersectionObserver(
    async (entries) => {
      const entry = entries.find((item) => item.target === sectionRef.value);

      if (entry?.isIntersecting) {
        observer?.disconnect();
        await nextTick();
        await playIconAnimations();
      }
    },
    {
      threshold: 1,
    }
  );

  observer.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  disposeTimeline();
});
</script>

<template>
  <div ref="sectionRef" class="greenTag">
    <h2>Une société engagée</h2>
    <div class="actions">
      <div v-for="(action, i) in actions" :key="i" class="action">
        <span class="h1">{{ index(i) }}.</span>
        <div class="content">
          <div class="title">
            <img ref="iconRefs" :src="images[i]" alt="Action icon" />
            <h3>{{ action.title }}</h3>
          </div>
          <p>{{ action.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.greenTag {
  background-color: black;
  padding-block: 100px;
  padding-inline: 30px;
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 75px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 40px;
    opacity: 0.5;
  }
  &:before {
    top: 0;
    background: radial-gradient(
      ellipse at 50% 0%,
      rgba(#177353, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  &:after {
    bottom: 0;
    background: radial-gradient(
      ellipse at 50% 100%,
      rgba(#177353, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }

  h2 {
    color: #40c057;
    text-align: center;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 75px;

    .action {
      display: flex;
      max-width: 500px;
      gap: 15px;

      .content {
        display: flex;
        flex-direction: column;

        .title {
          background-color: black;
          @include glow-discret(#29c397);
          border-radius: 12px;

          display: flex;
          gap: 35px;
          padding: 15px;

          h3 {
            max-width: 225px;
          }

          img {
            width: 50px;
            object-fit: contain;
          }
        }
      }
    }
  }
}
</style>

import { NuxtApp } from "nuxt/schema";
import { ComponentCustomProperties } from "vue";

type TruncateFn = (
  input: unknown,
  limit?: number,
  ellipsis?: string
) => string;

declare module "nuxt/schema" {
  interface NuxtApp {
    $truncate: TruncateFn;
  }
}

declare module "#app" {
  interface NuxtApp {
    $truncate: TruncateFn;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $truncate: TruncateFn;
  }
}

export {};

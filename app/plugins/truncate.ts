import { defineNuxtPlugin } from "#app";

type TruncateFn = (
  input: unknown,
  limit?: number,
  ellipsis?: string
) => string;

const truncate: TruncateFn = (input, limit = 250, ellipsis = "...") => {
  if (input == null) return "";
  const str = typeof input === "string" ? input : String(input);
  if (limit <= 0) return ellipsis;
  if (str.length <= limit) return str;
  return str.slice(0, limit) + ellipsis;
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("truncate", truncate);
});

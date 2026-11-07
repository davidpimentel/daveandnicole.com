import { defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import z from "zod";

export type Entry = {
  name: string;
  url: string;
  image?: string;
  price?: string;
  note?: string;
  boughtBy?: string;
};

export const server = {
  updateOwieRegistry: defineAction({
    input: z.object({
      owieRegistryJson: z.string(),
    }),

    handler: async ({ owieRegistryJson }, ctx) => {
      await env.DANDN_KV.put("owen-entries", owieRegistryJson);
      return true;
    },
  }),
};

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
      boughtBy: z.string().optional(),
      boughtIndex: z.number().optional(),
    }),

    handler: async ({ owieRegistryJson, boughtBy, boughtIndex }, ctx) => {
      await env.DANDN_KV.put("owen-entries", owieRegistryJson);
      try {
        if (boughtBy && boughtIndex !== undefined) {
          const entries = JSON.parse(owieRegistryJson);
          const entry = entries[boughtIndex];
          ctx.locals.cfContext.waitUntil(
            env.EMAIL.send({
              to: "david.pimentel65@gmail.com",
              from: "notification@daveandnicole.com",
              subject: `${boughtBy} bought something!`,
              text: JSON.stringify(entry, null, 2),
            }).catch((e) => console.error("email failed", e.code, e.message)),
          );
        }
      } catch (e) {
        console.error("could not send email", e);
      }
      return true;
    },
  }),
};

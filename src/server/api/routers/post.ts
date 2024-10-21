import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
  .input(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
      email: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("Received input:", input);  // Log the received input
    return ctx.db.user.create({
      data: {
        username: input.username,
        password: input.password,
        email: input.email || null,
      },
    });
  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.user.findFirst({
      where: { id: ctx.session.user.id },
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

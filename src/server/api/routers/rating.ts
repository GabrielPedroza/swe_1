import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ratingRouter = createTRPCRouter({
  createRating: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        score: z.number().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { bookId, score } = input;
      const userId = ctx.session.user.id;

      // Check if the user has already rated the book
      const existingRating = await ctx.db.rating.findUnique({
        where: {
          bookId_userId: {
            bookId,
            userId,
          },
        },
      });

      if (existingRating) {
        throw new Error("You have already rated this book.");
      }

      // Create the rating
      const rating = await ctx.db.rating.create({
        data: {
          bookId,
          userId,
          score,
        },
      });

      return rating;
    }),

  getRating: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        userId: z.string(),
      }),
    )

    .query(async ({ ctx, input }) => {
      const { userId, bookId } = input;
      const existingRating = await ctx.db.rating.findUnique({
        where: {
          bookId_userId: {
            bookId,
            userId,
          },
        },
      });

      return existingRating;
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const ratingRouter = createTRPCRouter({
  createRating: protectedProcedure
    .input(
      z.object({
        rating: z.number().int().min(1).max(5),
        userId: z.string(),
        bookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { rating, userId, bookId } = input;
      const userFound = await ctx.db.user.findUnique({
        where: { id: userId },
      });
      if (!userFound) throw new Error("User not found");
      const newRating = await ctx.db.rating.create({
        data: {
          score: rating,
          user: { connect: { id: userId } },
          book: { connect: { id: bookId } },
          ratingDate: new Date(),
        },
      });
      return newRating;
    }),

  getAverageRating: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { bookId } = input;
      const averageRating = await ctx.db.rating.aggregate({
        where: { bookId },
        _avg: { score: true },
      });
      const truncatedAvg = Math.floor((averageRating._avg.score || 0) * 100) / 100;
      return { averageRating: truncatedAvg };
    }),

  getRatingList: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { bookId } = input;
      const ratingList = await ctx.db.rating.findMany({
        where: { bookId },
        include: {
          user: {
            select: { id: true, username: true },
          },
        },
      });
      return { ratingList };
    }),

  getRating: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { bookId, userId } = input;
      const userRating = await ctx.db.rating.findFirst({
        where: {
          bookId,
          userId,
        },
      });

      if (!userRating) {
        return null; // Return null if no rating exists
      }

      return userRating;
    }),
});

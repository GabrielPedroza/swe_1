import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  createReview: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        content: z.string().min(10, "Review must be at least 10 characters"),
        score: z.number().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { bookId, content, score } = input;
      const userId = ctx.session.user.id;

      // Check if the user has already reviewed the book
      const existingReview = await ctx.db.review.findUnique({
        where: {
          bookId_userId: {
            bookId,
            userId,
          },
        },
      });

      if (existingReview) {
        throw new Error("You have already reviewed this book.");
      }

      // Create the review
      const review = await ctx.db.review.create({
        data: {
          bookId,
          userId,
          content,
          score,
          reviewDate: new Date(),
        },
      });

      return review;
    }),
});

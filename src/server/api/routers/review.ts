import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reviewsRouter = createTRPCRouter({
  // Fetch reviews with optional filters for bookId or userId
  getReviews: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        filters: z
          .object({
            bookId: z.string().optional(),
            userId: z.string().optional(),
            reviewDate: z.date().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, filters } = input;
      const where: any = {};

      if (filters) {
        if (filters.bookId) where.bookId = filters.bookId;
        if (filters.userId) where.userId = filters.userId;
        if (filters.reviewDate) where.reviewDate = filters.reviewDate;
      }

      const reviews = await ctx.db.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          book: {
            select: { id: true, title: true, author: true },
          },
          user: {
            select: { id: true, username: true, image: true },
          },
        },
      });

      return reviews;
    }),

  // Fetch a specific review by its ID
  getReviewById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.id },
        include: {
          book: {
            select: { id: true, title: true, author: true },
          },
          user: {
            select: { id: true, username: true, image: true },
          },
        },
      });

      if (!review) {
        throw new Error("Review not found");
      }

      return review;
    }),

  // Create a new review
  createReview: protectedProcedure
    .input(
      z.object({
        bookId: z.string().min(1, "Book ID is required"),
        userId: z.string().min(1, "User ID is required"),
        content: z.string().min(1, "Content is required"),
        reviewDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newReview = await ctx.db.review.create({
        data: {
          bookId: input.bookId,
          userId: input.userId,
          content: input.content,
          reviewDate: input.reviewDate ?? new Date(),
        },
      });
      return newReview;
    }),

  // Update a review
  updateReview: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Review ID is required"),
        content: z.string().min(1, "Updated content is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedReview = await ctx.db.review.update({
        where: { id: input.id },
        data: {
          content: input.content,
        },
      });

      return updatedReview;
    }),

  // Delete a review
  deleteReview: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Review ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.review.delete({
        where: { id: input.id },
      });

      return { success: true, message: "Review deleted successfully" };
    }),
});

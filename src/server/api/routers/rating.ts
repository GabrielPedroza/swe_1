import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API route handler for GET requests to fetch a user by username
export const ratingRouter = createTRPCRouter({
  createRating: publicProcedure
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
  if(!userFound) throw new Error("User not found");
  const newRating = await ctx.db.rating.create({
    data: {
      score: rating,
      user: { connect: { id: userId}},
      book: { connect: { id: bookId }},
      ratingDate: new Date(),
    },
  });
  return newRating;
}),

getAverageRating: publicProcedure
  .input(
    z.object({
      bookId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { bookId } = input;
    const averageRating = await ctx.db.rating.aggregate({
      where: { bookId },
      _avg: { score: true},
    });
    const truncatedAvg = Math.floor((averageRating._avg.score || 0) * 100) / 100;
    return { averageRating: truncatedAvg };
  }),
});

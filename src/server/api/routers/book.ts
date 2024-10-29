import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const booksRouter = createTRPCRouter({
  getBooks: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        filters: z
          .object({
            title: z.string().optional(),
            author: z.string().optional(),
            genre: z.string().optional(),
            priceMin: z.number().optional(),
            priceMax: z.number().optional(),
            publishedAfter: z.date().optional(),
            publishedBefore: z.date().optional(),
            tags: z.array(z.string()).optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx }) => {
      return await ctx.db.book.findMany();
    }),
  getBookById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const book = await ctx.db.book.findUnique({
        where: { id: input.id },
        include: {
          reviews: {
            include: {
              user: {
                select: { id: true, username: true, image: true },
              },
            },
          },
          ratings: {
            include: {
              user: {
                select: { id: true, username: true, image: true },
              },
            },
          },
        },
      });

      if (!book) {
        throw new Error("Book not found");
      }

      return book;
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const booksRouter = createTRPCRouter({
  // Endpoint to fetch paginated and filtered books
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
    .query(async ({ ctx, input }) => {
      const { page, limit, filters } = input;
      const offset = (page - 1) * limit;

      // Building the WHERE clause based on filters
      const where: any = {};

      if (filters) {
        const {
          title,
          author,
          genre,
          priceMin,
          priceMax,
          publishedAfter,
          publishedBefore,
          tags,
        } = filters;

        if (title) {
          where.title = { contains: title, mode: "insensitive" };
        }

        if (author) {
          where.author = { contains: author, mode: "insensitive" };
        }

        if (genre) {
          where.genre = { contains: genre, mode: "insensitive" };
        }

        if (priceMin !== undefined || priceMax !== undefined) {
          where.price = {};
          if (priceMin !== undefined) {
            where.price.gte = priceMin;
          }
          if (priceMax !== undefined) {
            where.price.lte = priceMax;
          }
        }

        if (publishedAfter || publishedBefore) {
          where.publishedAt = {};
          if (publishedAfter) {
            where.publishedAt.gte = publishedAfter;
          }
          if (publishedBefore) {
            where.publishedAt.lte = publishedBefore;
          }
        }

        if (tags && tags.length > 0) {
          where.tags = {
            hasEvery: tags,
          };
        }
      }

      // Fetch total count for pagination
      const total = await ctx.db.book.count({
        where,
      });

      // Fetch paginated books
      const books = await ctx.db.book.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { publishedAt: "desc" }, // You can adjust the ordering as needed
      });

      return {
        books,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
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

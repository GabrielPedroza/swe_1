import { array, string, z } from "zod";
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
            publishedAt: z.date().optional(),
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

  createBook: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        author: z.string().min(1, "Author is required"),
        genre: z.string().min(1, "Genre is required"),
        description: z.string().min(1, "Description is required"),
        price: z.number().min(1, "Price is required"),
        tags: array(z.string()).optional(),
        publishedAt: z.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newBook = await ctx.db.book.create({
        data: {
          title: input.title,
          author: input.author,
          genre: input.genre,
          description: input.description,
          price: input.price,
          tags: input.tags,
          publishedAt: input.publishedAt ?? undefined,
        },
      });
      return newBook;
    }),
});

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
            isbn: z.string().optional(),
            title: z.string().optional(),
            author: z.string().optional(),
            publisher: z.string().optional(),
            genre: z.string().optional(),
            priceMin: z.number().optional(),
            priceMax: z.number().optional(),
            publishedAt: z.date().optional(),
            tags: z.array(z.string()).optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, filters } = input;
      const where: any = {};

      if (filters) {
        if (filters.isbn) where.isbn = filters.isbn;
        if (filters.title)
          where.title = { contains: filters.title, mode: "insensitive" };
        if (filters.author)
          where.author = { contains: filters.author, mode: "insensitive" };
        if (filters.publisher)
          where.publisher = {
            contains: filters.publisher,
            mode: "insensitive",
          };
        if (filters.genre)
          where.genre = { contains: filters.genre, mode: "insensitive" };
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
          where.price = {};
          if (filters.priceMin !== undefined)
            where.price.gte = filters.priceMin;
          if (filters.priceMax !== undefined)
            where.price.lte = filters.priceMax;
        }
        if (filters.publishedAt) where.publishedAt = filters.publishedAt;
        if (filters.tags && filters.tags.length > 0)
          where.tags = { hasSome: filters.tags };
      }

      const books = await ctx.db.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      return books;
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
        isbn: z.string().min(1, "isbn is required"),
        title: z.string().min(1, "Title is required"),
        author: z.string().min(1, "Author is required"),
        publisher: z.string().min(1),
        genre: z.string().min(1, "Genre is required"),
        description: z.string().min(1, "Description is required"),
        price: z.number().min(1, "Price is required"),
        tags: array(z.string()).optional(),
        publishedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newBook = await ctx.db.book.create({
        data: {
          isbn: input.isbn,
          title: input.title,
          author: input.author,
          publisher: input.publisher,
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

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authorRouter = createTRPCRouter({
  // Create an author
  createAuthor: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        biography: z.string(),
        publisher: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newAuthor = await ctx.db.author.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          biography: input.biography,
          publisher: input.publisher,
        },
      });
      return newAuthor;
    }),
  // Get an author
  getAuthorByName: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const authors = await ctx.db.author.findMany({
        where: {
          OR: [{ firstName: input }, { lastName: input }],
        },
      });
      return authors;
    }),
  // Update an author
  updateAuthor: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        biography: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedAuthor = await ctx.db.author.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          biography: input.biography,
        },
      });
      return updatedAuthor;
    }),

  // Get books associated with an author by authorId
  getBooksByAuthor: protectedProcedure
    .input(z.string()) // Accepts authorId (string)
    .query(async ({ ctx, input }) => {
      const books = await ctx.db.book.findMany({
        where: {
          author: input, 
        },
      });
      return books; // Return books associated with author
    }),
});

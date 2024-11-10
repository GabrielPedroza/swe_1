import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const authorRouter = createTRPCRouter({
    createAuthor: protectedProcedure // Create an author
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
  
      getAuthorByName: protectedProcedure // Get the author by first name or last name
      .input(z.string())
      .query(async ({ ctx, input }) => {
        const authors = await ctx.db.author.findMany({
          where: {
            OR: [
              { firstName: input },
              { lastName: input }, 
            ],
          },
        });
        return authors; // This will return an array of authors
      }),
    
  
    updateAuthor: protectedProcedure // Update author info 
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
  });
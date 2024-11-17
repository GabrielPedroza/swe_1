import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const updateUserRouter = createTRPCRouter({
  updateUser: publicProcedure
    .input(
      z.object({
        username: z.string().min(1), // Username to identify the user
        updates: z
          .object({
            password: z.string().optional(),
            image: z.string().optional(),
          })
          .refine((data) => Object.keys(data).length > 0, "No updates provided"), // Ensure at least one update field is provided
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: {
          username: input.username,
        },
        data: input.updates,
      });

      return updatedUser; // Optional: Return updated user for confirmation
    }),
});

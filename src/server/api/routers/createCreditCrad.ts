import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const createCreditCardRouter = createTRPCRouter({
  createCreditCard: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        cardDetails: z.object({
          cardNumber: z.string().min(16).max(16), // Validate card number length
          cardHolderName: z.string().min(1), // Cardholder name must be non-empty
          expirationDate: z.string(), // Expected in ISO format
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find the user by username
      const user = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Create the credit card for the user
      const creditCard = await ctx.db.creditCard.create({
        data: {
          userId: user.id,
          cardNumber: input.cardDetails.cardNumber,
          cardHolderName: input.cardDetails.cardHolderName,
          expirationDate: new Date(input.cardDetails.expirationDate),
        },
      });

      return creditCard; // Optional: Return created credit card for confirmation
    }),
});

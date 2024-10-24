import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
  addItem: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        quantity: z.number().min(1).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Find or create the user's shopping cart
      let cart = await ctx.db.shoppingCart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await ctx.db.shoppingCart.create({
          data: { userId },
        });
      }

      // Add or update the cart item
      const cartItem = await ctx.db.cartItem.upsert({
        where: {
          cartId_bookId: {
            cartId: cart.id,
            bookId: input.bookId,
          },
        },
        update: {
          quantity: {
            increment: input.quantity,
          },
        },
        create: {
          cartId: cart.id,
          bookId: input.bookId,
          quantity: input.quantity,
        },
      });

      return cartItem;
    }),

  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const cart = await ctx.db.shoppingCart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    return cart;
  }),
});

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

  removeItem: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const cart = await ctx.db.shoppingCart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      await ctx.db.cartItem.delete({
        where: {
          cartId_bookId: {
            cartId: cart.id,
            bookId: input.bookId,
          },
        },
      });

      return { success: true };
    }),

  updateItem: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const cart = await ctx.db.shoppingCart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      const cartItem = await ctx.db.cartItem.update({
        where: {
          cartId_bookId: {
            cartId: cart.id,
            bookId: input.bookId,
          },
        },
        data: {
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
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const cart = await ctx.db.shoppingCart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    await ctx.db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return { success: true };
  }),
});

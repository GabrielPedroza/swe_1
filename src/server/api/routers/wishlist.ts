import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const wishlistRouter = createTRPCRouter({
  // List books in a user's wishlist
  getWishlist: protectedProcedure
    .input(
      z.object({
        wishlistId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.wishlistItem.findMany({
        where: { wishlistId: input.wishlistId },
        include: { book: true },
      });
    }),

  // Add a book to a user's wishlist
  addToWishlist: protectedProcedure
    .input(
      z.object({
        wishlistId: z.string(),
        bookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wishlistItem.create({
        data: {
          wishlistId: input.wishlistId,
          bookId: input.bookId,
        },
      });
    }),

  // Remove a book from a wishlist
  removeBookFromWishlist: protectedProcedure
    .input(
      z.object({
        wishlistId: z.string(),
        bookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wishlistItem.deleteMany({
        where: {
          wishlistId: input.wishlistId,
          bookId: input.bookId,
        },
      });
    }),

  // Remove a book from a user's wishlist and add it to their shopping cart
  moveToCart: protectedProcedure
    .input(
      z.object({
        wishlistItemId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const wishlistItem = await ctx.db.wishlistItem.delete({
        where: { id: input.wishlistItemId },
        include: { book: true },
      });

      const cart = await ctx.db.shoppingCart.upsert({
        where: { userId: input.userId },
        create: { userId: input.userId },
        update: {},
      });

      return ctx.db.cartItem.create({
        data: {
          cartId: cart.id,
          bookId: wishlistItem.bookId,
        },
      });
    }),

  // Create a new wishlist
  createWishlist: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id; // Get user ID from session

      return ctx.db.wishlist.create({
        data: {
          name: input.name,
          userId: userId, // Use user ID from session
        },
      });
    }),

  // Delete a wishlist
  deleteWishlist: protectedProcedure
    .input(z.object({ wishlistId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.wishlistItem.deleteMany({
        where: { wishlistId: input.wishlistId },
      });

      await ctx.db.wishlist.delete({
        where: { id: input.wishlistId },
      });

      return { success: true };
    }),

  // Get all user wishlists
  getUserWishlists: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return ctx.db.wishlist.findMany({
      where: { userId },
      select: { id: true, name: true },
    });
  }),
});

import { postRouter } from "~/server/api/routers/post";
import { authRouter } from "~/server/api/routers/authentication";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { booksRouter } from "./routers/book";
import { reviewRouter } from "./routers/review";
import { ratingRouter } from "./routers/rating";
import { cartRouter } from "./routers/cart";
import { userRouter } from "./routers/user";
import { creditCardRouter } from "./routers/creditCard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  book: booksRouter,
  review: reviewRouter,
  rating: ratingRouter,
  cart: cartRouter,
  user: userRouter,
  creditCard: creditCardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

import { authRouter } from "~/server/api/routers/authentication";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { booksRouter } from "./routers/book";
import { cartRouter } from "./routers/cart";
import { authorRouter } from "./routers/author";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  book: booksRouter,
  cart: cartRouter,
  author: authorRouter,
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

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
  .input(
    z.object({
      content: z.string(),
      userId: z.string(),
      bookId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { content, userId, bookId } = input;
    const userFound = await ctx.db.user.findUnique({
      where: { id: userId },
    });
  if(!userFound) throw new Error("User not found");
  const newComment = await ctx.db.review.create({
    data: {
      content,
      user: { connect: { id: userId}},
      book: { connect: { id: bookId }},
      reviewDate: new Date(),
    },
  });
  return newComment;
}),

  getCommentList: protectedProcedure
  .input(
    z.object({
      bookId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { bookId } = input;
    console.log("got bookId: ", bookId);
    const commentList = await ctx.db.review.findMany({
      where: { bookId },
      include: {
        user:{
          select: { id: true, username: true}
        },
      },
    });
    return { commentList };
  }),
});

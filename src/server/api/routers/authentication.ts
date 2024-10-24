import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        username: z.string().min(6, "Username must be at least 6 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, username, password } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await ctx.db.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      return { status: "success", message: "User registered successfully" };
    }),
});

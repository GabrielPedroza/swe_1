import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import { env } from "~/env";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "~/validation/auth";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      isAdmin: boolean;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const AdminEmails = [
  "example12@gmail.com",
  "example123@gmail.com",

  // Add more sample emails here if needed. 
]

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email as string; // Type Assertion 
        token.isAdmin = AdminEmails.includes(token.email)
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean; // Checks for admin status
      }

      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    newUser: "/signup",
    error: "/signin",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const cred = await loginSchema.parseAsync(credentials);

        const user = await db.user.findFirst({
          where: { email: cred.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = bcrypt.compareSync(
          cred.password,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);

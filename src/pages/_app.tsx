import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";
import AuthGuard from "~/components/AuthGuard";
import "~/styles/globals.css";
import Header from "~/components/Header";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  // Define routes that don't require authentication
  const noAuthRequired = ["/signin", "/signup"];

  // Check if the current route is in the list of routes that don't require authentication
  const isAuthRoute = noAuthRequired.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      <Header />
      {isAuthRoute ? (
        // If it's an auth route, render the component directly
        <Component {...pageProps} />
      ) : (
        // Otherwise, wrap it with AuthGuard
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

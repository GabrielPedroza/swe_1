// components/AuthGuard.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated, redirect to /signin
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  // While loading, you can render a loading state or nothing
  if (status === "loading") {
    return null; // Or a loading spinner
  }

  // If authenticated, render the children components
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};

export default AuthGuard;

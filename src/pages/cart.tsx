import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const ShoppingCart: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    isLoading,
    isError,
  } = api.cart.getCart.useQuery(undefined, {
    enabled: !!session?.user,
  });

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-gray-600">Loading your shopping cart...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-red-600">
          Error loading your shopping cart.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      shopping cart page
    </div>
  );
};

export default ShoppingCart;

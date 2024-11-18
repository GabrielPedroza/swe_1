import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Button from "./Button";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch cart data to get the number of items
  const {
    data: cart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = api.cart.getCart.useQuery(undefined, {
    enabled: !!session?.user,
  });

  // Calculate total number of items in the cart
  const totalItemsInCart =
    cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  // Handle navigation to cart page
  const handleCartClick = () => {
    router.push("/cart");
  };

  // Handle navigation to login page
  const handleLoginClick = () => {
    router.push("/signin"); // Assuming your login page is at /signin
  };

  // Handle navigation to dashboard
  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  // Handle logout
  const handleLogoutClick = () => {
    signOut({ callbackUrl: "/signin" });
  };

  const handleRatingClick = () => {
    router.push("/rating");
  }

  const handleCommentClick = () => {
    router.push("/comment");
  }

  return (
    <header className="bg-gray-800 py-4 text-white">
      <div className="container flex min-w-full items-center justify-between px-4">
        {/* Logo or Site Name */}
        <div
          className="cursor-pointer text-xl font-bold"
          onClick={() => router.push("/")}
        >
          MyBookStore
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {/* Show Dashboard link if authenticated */}
          {session?.user && (
            <Button
              onClick={handleDashboardClick}
              className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            >
              Dashboard
            </Button>
          )}

          {session?.user && (
            <Button
              onClick={handleRatingClick}
              className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                Ratings
            </Button>
          )}

          {session?.user && (
            <Button
              onClick={handleCommentClick}
              className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                Comments
            </Button>
          )}

          {/* Cart Button */}
          {session?.user && (
            <Button
              onClick={handleCartClick}
              className="flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Cart
              {isCartLoading ? (
                <svg
                  className="ml-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-sm text-white">
                  {totalItemsInCart}
                </span>
              )}
            </Button>
          )}


          {/* Login / Logout */}
          {status === "loading" ? null : session?.user ? (
            <Button
              onClick={handleLogoutClick}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={handleLoginClick}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Login
            </Button>
          )}
          
        </div>
      </div>
    </header>
  );
};

export default Header;

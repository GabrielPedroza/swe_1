// components/ShoppingCart.tsx
import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Button from "~/components/Button";
import { useRouter } from "next/router";

const ShoppingCart: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    data: cart,
    isLoading,
    isError,
  } = api.cart.getCart.useQuery(undefined, {
    enabled: !!session?.user,
  });

  const utils = api.useContext();

  const removeItemMutation = api.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
    },
  });

  const updateItemMutation = api.cart.updateItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
    },
  });

  // New mutation for clearing the cart
  const clearCartMutation = api.cart.clearCart.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Failed to complete checkout:", error);
      alert("Failed to complete checkout. Please try again.");
    },
  });

  const handleCompleteCheckout = () => {
    clearCartMutation.mutate();
  };

  if (!session?.user) {
    router.push("/login"); // Redirect to login page if not authenticated
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

  const handleRemoveItem = (bookId: string) => {
    removeItemMutation.mutate({ bookId });
  };

  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    updateItemMutation.mutate({ bookId, quantity });
  };

  const totalPrice = cart?.items.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      {/* Back to Dashboard Button */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          onClick={() => router.push("/dashboard")}
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          &larr; Back to Dashboard
        </Button>
        <h2 className="text-2xl font-semibold text-gray-800">
          Your Shopping Cart
        </h2>
      </div>

      {cart?.items.length ? (
        <>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b-2 pb-2">Book</th>
                <th className="border-b-2 pb-2">Quantity</th>
                <th className="border-b-2 pb-2">Price</th>
                <th className="border-b-2 pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">
                    <p className="text-gray-800">{item.book.title}</p>
                    <p className="text-sm text-gray-500">{item.book.author}</p>
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.bookId,
                          Number(e.target.value),
                        )
                      }
                      className="w-16 rounded border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="py-2">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-2">
                    <Button
                      onClick={() => handleRemoveItem(item.bookId)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <p className="text-xl font-semibold text-gray-800">
              Total: ${totalPrice?.toFixed(2)}
            </p>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              onClick={handleCompleteCheckout}
              className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              disabled={clearCartMutation.isPending}
            >
              {clearCartMutation.isPending
                ? "Completing..."
                : "Complete Checkout"}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Your shopping cart is empty.</p>
      )}
    </div>
  );
};

export default ShoppingCart;

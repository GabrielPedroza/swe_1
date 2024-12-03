import { useRouter } from "next/router";
import { useState } from "react";
import Button from "~/components/Button";
import { api } from "~/utils/api";

export default function UserProfilePage() {
  const router = useRouter();
  const { userId } = router.query;

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [newWishlistName, setNewWishlistName] = useState<string>("");

  // Fetch user wishlists
  const { data: wishlists, isLoading: isWishlistsLoading, refetch: refetchWishlists } =
    api.wishlists.getUserWishlists.useQuery();

  // Fetch books in the selected wishlist
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);
  const { data: wishlistBooks, isLoading: isBooksLoading, refetch: refetchWishlistBooks } =
    api.wishlists.getWishlist.useQuery(
      { wishlistId: selectedWishlistId ?? "" },
      { enabled: !!selectedWishlistId }
    );

  // Mutations
  const createWishlistMutation = api.wishlists.createWishlist.useMutation({
    onSuccess: () => {
      refetchWishlists();
      setNewWishlistName(""); // Reset input field
    },
  });

  const deleteWishlistMutation = api.wishlists.deleteWishlist.useMutation({
    onSuccess: () => {
      refetchWishlists();
      setSelectedWishlistId(null);
    },
  });

  const removeBookFromWishlistMutation = api.wishlists.removeBookFromWishlist.useMutation({
    onSuccess: () => {
      refetchWishlistBooks();
    },
  });

  const addToCartMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      refetchWishlistBooks();
    },
  });

  // Handle creating a new wishlist
  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) {
      return alert("Wishlist name cannot be empty");
    }
    try {
      await createWishlistMutation.mutateAsync({ name: newWishlistName });
    } catch (error) {
      console.error("Error creating wishlist:", error);
    }
  };

  // Handle deleting a wishlist
  const handleDeleteWishlist = async (wishlistId: string) => {
    setProcessingId(wishlistId);
    try {
      await deleteWishlistMutation.mutateAsync({ wishlistId });
    } catch (error) {
      console.error("Error deleting wishlist:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle removing a book from the wishlist
  const handleRemoveBook = async (bookId: string) => {
    setProcessingId(bookId);
    try {
      await removeBookFromWishlistMutation.mutateAsync({
        wishlistId: selectedWishlistId!,
        bookId,
      });
    } catch (error) {
      console.error("Error removing book from wishlist:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle moving a book to the cart
  const handleMoveToCart = async (bookId: string) => {
    setProcessingId(bookId);
    try {
      await addToCartMutation.mutateAsync({ bookId, quantity: 1 });
      await removeBookFromWishlistMutation.mutateAsync({
        wishlistId: selectedWishlistId!,
        bookId,
      });
    } catch (error) {
      console.error("Error moving book to cart:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle wishlist selection
  const handleSelectWishlist = (wishlistId: string) => {
    setSelectedWishlistId(wishlistId);
  };

  if (isWishlistsLoading || isBooksLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">User Wishlists</h1>

      {/* Create Wishlist Section */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Create a New Wishlist</h2>
        <div className="flex gap-4 mt-2">
          <input
            type="text"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            placeholder="Enter wishlist name"
            className="p-2 border rounded w-full"
          />
          <Button onClick={handleCreateWishlist} className="bg-green-500 text-white">
            Create Wishlist
          </Button>
        </div>
      </div>

      {/* Select Wishlist Section */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Select a Wishlist</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          {wishlists?.map((wishlist) => (
            <div key={wishlist.id} className="flex items-center gap-2">
              <Button
                className={`px-4 py-2 rounded ${
                  selectedWishlistId === wishlist.id ? "bg-blue-500 text-white" : "opacity-50"
                }`}
                onClick={() => handleSelectWishlist(wishlist.id)}
              >
                {wishlist.name}
              </Button>
              <Button
                className="bg-red-500 text-white"
                disabled={processingId === wishlist.id}
                onClick={() => handleDeleteWishlist(wishlist.id)}
              >
                {processingId === wishlist.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Wishlist Books Section */}
      {wishlistBooks && wishlistBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistBooks.map((book) => (
            <div key={book.id} className="p-4 shadow-lg border rounded-md">
              <h2 className="text-xl font-semibold">{book.book.title}</h2>
              <p className="text-gray-600">Author: {book.book.author}</p>
              <p className="text-gray-600">Genre: {book.book.genre}</p>
              <p className="text-gray-600">Price: ${book.book.price.toFixed(2)}</p>
              <p className="text-gray-500 text-sm">Added on: {new Date(book.addedAt).toLocaleDateString()}</p>
              <div className="flex gap-4 mt-4">
                <Button
                  className="bg-red-500 text-white"
                  disabled={processingId === book.id}
                  onClick={() => handleRemoveBook(book.book.id)}
                >
                  {processingId === book.id ? "Removing..." : "Remove"}
                </Button>
                <Button
                  className="bg-blue-500 text-white"
                  disabled={processingId === book.book.id}
                  onClick={() => handleMoveToCart(book.book.id)}
                >
                  {processingId === book.book.id ? "Moving to Cart..." : "Move to Cart"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p>No books in this wishlist.</p>
        </div>
      )}
    </div>
  );
}

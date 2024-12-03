import React, { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Button from "~/components/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { EyeIcon } from "@heroicons/react/24/outline";
import FilterForm from "~/components/form/FilterForm";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const {
    data: books,
    isLoading,
    isError,
  } = api.book.getBooks.useQuery({
    page: 1,
    limit: 10,
    filters: filters,
  });

  const {
    data: wishlists,
    isLoading: isWishlistsLoading,
    isError: isWishlistsError,
  } = api.wishlists.getUserWishlists.useQuery();

  const addItemToCartMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      alert("Book added to cart!");
    },
    onError: (error) => {
      alert(`Failed to add book to cart: ${error.message}`);
    },
  });

  const addToWishlistMutation = api.wishlists.addToWishlist.useMutation({
    onSuccess: () => {
      alert("Book added to wishlist!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      alert(`Failed to add book to wishlist: ${error.message}`);
    },
  });

  const handleAddToCart = (bookId: string) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    addItemToCartMutation.mutate({ bookId });
  };

  const handleAddToWishlist = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsModalOpen(true);
  };

  const handleAddBookToWishlist = (wishlistId: string) => {
    if (!selectedBookId) return;
    addToWishlistMutation.mutate({ wishlistId, bookId: selectedBookId });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4">
      <FilterForm onFilterChange={setFilters} />
      <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Books List</h2>
        {isLoading ? (
          <p className="text-gray-700">Loading books...</p>
        ) : isError ? (
          <p className="text-red-500">Error fetching books.</p>
        ) : books && books.length > 0 ? (
          <ul className="space-y-4">
            {books.map((book) => (
              <li key={book.id} className="rounded-md border p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h3>
                <p className="text-gray-700">
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="text-gray-700">
                  <strong>Genre:</strong> {book.genre}
                </p>
                <p className="text-gray-700">
                  <strong>Price:</strong> ${book.price.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <strong>Published At:</strong>{" "}
                  {book.publishedAt
                    ? new Date(book.publishedAt).toLocaleDateString()
                    : " "}
                </p>
                <p className="text-gray-700">
                  <strong>Tags:</strong> {book.tags.join(", ")}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Button
                    onClick={() => handleAddToCart(book.id)}
                    className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    {addItemToCartMutation.isPending
                      ? "Adding..."
                      : "Add to Cart"}
                  </Button>
                  <Button
                    onClick={() => handleAddToWishlist(book.id)}
                    className="rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Add to Wishlist
                  </Button>
                  <Link
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    href={`/book/${book.id}`}
                  >
                    <EyeIcon height={24} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No books found.</p>
        )}
      </div>

      {isModalOpen && (
        <Dialog
          onDismiss={() => setIsModalOpen(false)}
          aria-labelledby="add-to-wishlist"
        >
          <h3 id="add-to-wishlist" className="text-lg font-semibold">
            Add to Wishlist
          </h3>
          {isWishlistsLoading ? (
            <p>Loading your wishlists...</p>
          ) : isWishlistsError ? (
            <p>Error loading wishlists.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {wishlists && wishlists.length > 0 ? wishlists.map((wishlist) => (
                <li key={wishlist.id}>
                  <Button
                    onClick={() => handleAddBookToWishlist(wishlist.id)}
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    {wishlist.name}
                  </Button>
                </li>
              )) : (<Link href={`/user/${session?.user.id}`}><Button>No wishlists? Create one now!</Button></Link>)}
            </ul>
          )}
          <Button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </Button>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;

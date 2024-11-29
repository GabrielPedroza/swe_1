import React from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Button from "~/components/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { EyeIcon } from "@heroicons/react/24/outline";

  const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    data: books,
    isLoading,
    isError,
  } = api.book.getBooks.useQuery({
  });

  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      alert("Book added to cart!");
    },
    onError: (error) => {
      alert(`Failed to add book to cart: ${error}`);
    },
  });

  const handleAddToCart = (bookId: string) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    addItemMutation.mutate({ bookId });
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
      <div>filters go here</div>
      <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Books List</h2>
        {isLoading ? (
          <p className="text-gray-700">Loading books...</p>
        ) : isError ? (
          <p className="text-red-500">Error fetching books.</p>
        ) : books && books.length > 0 ? (
          <>
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
                    {book.publishedAt ? new Date(book.publishedAt).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Tags:</strong> {book.tags.join(", ")}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div>
                      <Button
                        onClick={() => handleAddToCart(book.id)}
                        className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        {addItemMutation.isPending
                          ? "Adding..."
                          : "Add to Cart"}
                      </Button>
                    </div>
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
          </>
        ) : (
          <p className="text-gray-700">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

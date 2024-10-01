// components/Dashboard.tsx
import React, { useState } from "react";
import { api } from "~/utils/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import debounce from "lodash.debounce";
import InputField from "~/components/InputField";
import Button from "~/components/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { EyeIcon } from "@heroicons/react/24/outline";

interface IFilterForm {
  title?: string;
  author?: string;
  genre?: string;
  priceMin?: number;
  priceMax?: number;
  publishedAfter?: Date;
  publishedBefore?: Date;
  tags?: string[];
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10; // Books per page

  // Filters state
  const [filters, setFilters] = useState<IFilterForm>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFilterForm>({
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      priceMin: undefined,
      priceMax: undefined,
      publishedAfter: undefined,
      publishedBefore: undefined,
      tags: undefined,
    },
  });

  // Fetch books with current page and filters
  const {
    data: books,
    isLoading,
    isError,
  } = api.book.getBooks.useQuery({
    page,
    limit,
    filters,
  });

  // Mutation to add item to cart
  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      // Optionally, show a success message or update UI
      // alert("Book added to cart!");
    },
    onError: (error) => {
      // Handle error
      alert("Failed to add book to cart.");
    },
  });

  const handleAddToCart = (bookId: string) => {
    if (!session?.user) {
      router.push("/login"); // Redirect to login page if not authenticated
      return;
    }
    addItemMutation.mutate({ bookId });
  };

  const submit: SubmitHandler<IFilterForm> = (data) => {
    console.log(data);
    setFilters(data);
    setPage(1); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Redirect to login or show message
    router.push("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4">
      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Filter Books
        </h2>
        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <InputField
            label="Title"
            id="title"
            type="text"
            placeholder="Book title"
            register={register}
            error={errors.title}
          />

          <InputField
            label="Author"
            id="author"
            type="text"
            placeholder="Author name"
            register={register}
            error={errors.author}
          />

          <InputField
            label="Genre"
            id="genre"
            type="text"
            placeholder="Genre"
            register={register}
            error={errors.genre}
          />

          <InputField
            label="Price Min"
            id="priceMin"
            type="number"
            placeholder="Minimum price"
            register={register}
            error={errors.priceMin}
          />

          <InputField
            label="Price Max"
            id="priceMax"
            type="number"
            placeholder="Maximum price"
            register={register}
            error={errors.priceMax}
          />

          <InputField
            label="Published After"
            id="publishedAfter"
            type="date"
            register={register}
            error={errors.publishedAfter}
          />

          <InputField
            label="Published Before"
            id="publishedBefore"
            type="date"
            register={register}
            error={errors.publishedBefore}
          />

          <InputField
            label="Tags (comma separated)"
            id="tags"
            type="text"
            placeholder="e.g., classic, adventure"
            register={register}
          />

          {/* Apply Filters button inside the form */}
          <div className="mt-4 flex justify-end sm:col-span-2">
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </div>

      {/* Books List */}
      <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Books List</h2>
        {isLoading ? (
          <p className="text-gray-700">Loading books...</p>
        ) : isError ? (
          <p className="text-red-500">Error fetching books.</p>
        ) : books && books.books.length > 0 ? (
          <>
            <ul className="space-y-4">
              {books.books.map((book) => (
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
                    {new Date(book.publishedAt).toLocaleDateString()}
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

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`rounded-md px-4 py-2 text-gray-700 transition duration-200 ${
                  page === 1
                    ? "cursor-not-allowed bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
              <span className="flex items-center text-gray-700">
                Page {books.page} of {books.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === books.totalPages}
                className={`rounded-md px-4 py-2 text-gray-700 transition duration-200 ${
                  page === books.totalPages
                    ? "cursor-not-allowed bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

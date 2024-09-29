// pages/book/[id].tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession, signOut } from "next-auth/react";
import Button from "~/components/Button";
import Link from "next/link";
import Modal from "~/components/Modal";
import ReviewForm from "~/components/form/ReviewForm";
import RatingForm from "~/components/form/RatingForm";

const BookDetails = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  // State for modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Fetch the book data
  const {
    data: book,
    isLoading,
    isError,
    refetch,
  } = api.book.getBookById.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    },
  );

  // Mutations for creating review and rating
  const createReviewMutation = api.review.createReview.useMutation({
    onSuccess: () => {
      refetch();
      setIsReviewModalOpen(false);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const createRatingMutation = api.rating.createRating.useMutation({
    onSuccess: () => {
      refetch();
      setIsRatingModalOpen(false);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Redirect to login or show message
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700">
          You are not authenticated. Please log in.
        </p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p className="text-red-500">Error fetching book details.</p>
      </div>
    );
  }

  // Check if the current user has already reviewed the book
  const userReview = book.reviews.find(
    (review) => review.user.id === session?.user.id,
  );

  // Check if the current user has already rated the book
  const userRating = book.ratings.find(
    (rating) => rating.user.id === session?.user.id,
  );

  // Calculate average rating
  const averageRating =
    book.ratings.length > 0
      ? (
          book.ratings.reduce((acc, rating) => acc + rating.score, 0) /
          book.ratings.length
        ).toFixed(2)
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800">Book Details</h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="bg-red-600 hover:bg-red-700"
        >
          Logout
        </Button>
      </div>

      {/* Back to Dashboard Link */}
      <div className="mb-4">
        <Link className="text-blue-600 hover:underline" href="/dashboard">
          Back to Dashboard
        </Link>
      </div>

      {/* Book Details */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          {book.title}
        </h2>
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
        <p className="text-gray-700">
          <strong>Average Rating:</strong>{" "}
          {averageRating ? `${averageRating} / 5` : "No ratings yet"}
        </p>

        {/* Create Rating Button or Display Existing Rating */}
        <div className="mt-4">
          {userRating ? (
            <div className="flex items-center space-x-2">
              <p className="text-gray-700">
                <strong>Your Rating:</strong> {userRating.score} / 5
              </p>
              {/* Optionally, add Edit Rating functionality */}
            </div>
          ) : (
            <Button
              onClick={() => setIsRatingModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Create Rating
            </Button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Reviews ({book.reviews.length})
          </h2>
          {!userReview ? (
            <Button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Review
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-gray-700">
                <strong>Your Review:</strong>
              </p>
              <p className="text-gray-700">{userReview.content}</p>
              {/* Optionally, add Edit Review functionality */}
            </div>
          )}
        </div>

        {/* List of Reviews */}
        {book.reviews.length > 0 ? (
          <ul className="space-y-4">
            {book.reviews.map((review) => (
              <li key={review.id} className="border-b pb-4">
                <div className="mb-2 flex items-center">
                  {review.user.image && (
                    <img
                      src={review.user.image}
                      alt={`${review.user.username}'s avatar`}
                      className="mr-2 h-8 w-8 rounded-full"
                    />
                  )}
                  <p className="font-semibold text-gray-700">
                    {review.user.username}
                  </p>
                  <span className="ml-2 text-sm text-gray-500">
                    on {new Date(review.reviewDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">
                  <strong>Score:</strong> {review.score} / 5
                </p>
                <p className="mt-2 text-gray-700">{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No reviews yet.</p>
        )}
      </div>

      {/* Create Review Modal */}
      {isReviewModalOpen && (
        <Modal onClose={() => setIsReviewModalOpen(false)}>
          <ReviewForm
            bookId={book.id}
            onSubmit={(data) => createReviewMutation.mutate(data)}
            onCancel={() => setIsReviewModalOpen(false)}
          />
        </Modal>
      )}

      {/* Create Rating Modal */}
      {isRatingModalOpen && (
        <Modal onClose={() => setIsRatingModalOpen(false)}>
          <RatingForm
            bookId={book.id}
            onSubmit={(data) => createRatingMutation.mutate(data)}
            onCancel={() => setIsRatingModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default BookDetails;

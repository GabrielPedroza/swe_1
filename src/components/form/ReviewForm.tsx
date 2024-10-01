// components/ReviewForm.tsx
import { Rating } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "~/components/Button";
import { api } from "~/utils/api";

interface ReviewFormProps {
  bookId: string;
  onSubmit: (data: ReviewInput) => void;
  onCancel: () => void;
}

interface ReviewInput {
  bookId: string;
  content: string;
  score: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    defaultValues: {
      bookId,
      content: "",
      score: 5,
    },
  });

  const submitHandler: SubmitHandler<ReviewInput> = (data) => {
    console.log("Submitting Review:", data); // For debugging
    onSubmit(data);
  };

  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Correctly use the useQuery hook at the top level
  const {
    data: userHasRating,
    isLoading,
    isError,
  } = api.rating.getRating.useQuery(
    {
      bookId,
      userId: userId ?? "",
    },
    {
      enabled: !!userId, // Only run the query if userId exists
    },
  );

  if (isLoading) {
    return <p>Loading your rating...</p>;
  }

  if (isError) {
    return <p>Error loading your rating. Please try again later.</p>;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Create Review</h2>

      <div>
        <label htmlFor="score" className="block text-gray-700">
          Score
        </label>
        {userHasRating ? (
          <h3>You rated this book at: {userHasRating.score}</h3>
        ) : (
          <>
            <select
              id="score"
              {...register("score", {
                required: "Score is required",
                valueAsNumber: true,
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.score && (
              <p className="mt-1 text-sm text-red-600">
                {errors.score.message}
              </p>
            )}
          </>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-gray-700">
          Review
        </label>
        <textarea
          id="content"
          {...register("content", {
            required: "Review content is required",
            minLength: {
              value: 10,
              message: "Review must be at least 10 characters",
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          placeholder="Write your review here..."
        ></textarea>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;

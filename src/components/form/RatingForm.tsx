// components/RatingForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "~/components/Button";

interface RatingFormProps {
  bookId: string;
  onSubmit: (data: RatingInput) => void;
  onCancel: () => void;
}

interface RatingInput {
  bookId: string;
  score: number;
}

const RatingForm: React.FC<RatingFormProps> = ({
  bookId,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RatingInput>({
    defaultValues: {
      bookId,
      score: 5,
    },
  });

  const submitHandler: SubmitHandler<RatingInput> = (data) => {
    console.log("Submitting Rating:", data); // For debugging
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Create Rating</h2>

      <div>
        <label htmlFor="score" className="block text-gray-700">
          Rating
        </label>
        <select
          id="score"
          {...register("score", {
            required: "Rating is required",
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
          <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
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
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </div>
    </form>
  );
};

export default RatingForm;

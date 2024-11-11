// components/FilterForm.tsx

import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";

interface FilterFormData {
  isbn?: string;
  title?: string;
  author?: string;
  publisher?: string;
  genre?: string;
  priceMin?: number;
  priceMax?: number;
  publishedAt?: Date;
  tags?: string[];
}

interface FilterFormProps {
  onFilterChange: (filters: FilterFormData) => void;
}

const FilterForm = ({ onFilterChange }: FilterFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterFormData>();

  const onSubmit = (data: FilterFormData) => {
    // Remove any fields that are undefined or empty
    const filters = Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== undefined && v !== "" && v !== null,
      ),
    );

    onFilterChange(filters);
  };

  const handleClear = () => {
    reset();
    onFilterChange({});
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-4 rounded bg-white p-4 shadow"
    >
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="ISBN"
          id="isbn"
          type="text"
          placeholder="Enter ISBN"
          register={register}
          error={errors.isbn}
        />
        <InputField
          label="Title"
          id="title"
          type="text"
          placeholder="Enter Title"
          register={register}
          error={errors.title}
        />
        <InputField
          label="Author"
          id="author"
          type="text"
          placeholder="Enter Author"
          register={register}
          error={errors.author}
        />
        <InputField
          label="Publisher"
          id="publisher"
          type="text"
          placeholder="Enter Publisher"
          register={register}
          error={errors.publisher}
        />
        <InputField
          label="Genre"
          id="genre"
          type="text"
          placeholder="Enter Genre"
          register={register}
          error={errors.genre}
        />
        <InputField
          label="Price Min"
          id="priceMin"
          type="number"
          placeholder="Minimum Price"
          register={register}
          error={errors.priceMin}
        />
        <InputField
          label="Price Max"
          id="priceMax"
          type="number"
          placeholder="Maximum Price"
          register={register}
          error={errors.priceMax}
        />
        <InputField
          label="Published At"
          id="publishedAt"
          type="date"
          register={register}
          error={errors.publishedAt}
        />
        <div className="col-span-2">
          <InputField
            label="Tags (comma separated)"
            id="tags"
            type="text"
            placeholder="e.g., Fiction, Mystery"
            register={register}
            error={errors.tags as any} // Cast to 'any' if TypeScript complains
          />
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Clear Filters
        </button>
      </div>
    </form>
  );
};

export default FilterForm;

// components/InputField.tsx

import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  register: UseFormRegister<any>; // More specific typing
  error?: FieldError;
}

const InputField = ({
  label,
  id,
  type,
  placeholder,
  register,
  error,
}: InputFieldProps) => {
  // Define registration options based on input type and id
  let registerOptions = {};

  if (id === "tags") {
    // Handle 'tags' input: return empty array if empty, else split by commas
    registerOptions = {
      setValueAs: (value: string) => {
        if (value.trim() === "") return [];
        return value.split(",").map((tag) => tag.trim());
      },
    };
  } else if (type === "number") {
    // Handle number inputs: return undefined if empty or invalid
    registerOptions = {
      setValueAs: (value: string) => {
        if (value === "") return undefined;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
      },
    };
  } else if (type === "date") {
    // Handle date inputs: return undefined if empty
    registerOptions = {
      setValueAs: (value: string) => {
        return value === "" ? undefined : value;
      },
    };
  }

  return (
    <div>
      <label className="mb-1 block text-gray-700" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        type={type}
        placeholder={placeholder}
        {...register(id, registerOptions)}
      />
      {error && (
        <span className="mt-1 text-sm text-red-500">{error.message}</span>
      )}
    </div>
  );
};

export default InputField;

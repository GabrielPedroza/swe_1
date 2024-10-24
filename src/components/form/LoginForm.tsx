import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import type { ILogin } from "~/validation/auth";

const LoginForm = () => {
  const router = useRouter();
  const { error } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    await signIn("credentials", { ...data, callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <p className="rounded bg-red-100 p-2 text-center text-red-600">
              Login failed, please check your credentials and try again.
            </p>
          )}
          <div>
            <label className="mb-1 block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={`w-full rounded-md border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="mt-1 text-sm text-red-500">
                This field is required.
              </span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={`w-full rounded-md border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="mt-1 text-sm text-red-500">
                This field is required.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

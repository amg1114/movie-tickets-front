"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import StyledInput from "../../_ui/components/forms/StyledInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../_utils/schemas/user.schema";
import { ILoginRequest } from "../../_models/requests/auth-req.interface";
import { useEffect, useState } from "react";
import FormFeedback, { IFormFeedbackProps } from "../../_ui/components/forms/FormFeedback";
import { AxiosError } from "axios";
import { useAuth } from "../../_context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login: loginUser, isAuthenticated, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/shows");
    }
  }, [isAuthenticated, isLoading, router]);

  const [state, setState] = useState<{
    error?: string;
    status: IFormFeedbackProps["status"];
  } | null>(null);

  const onSubmit = async (data: ILoginRequest) => {
    setState({ status: "loading" });
    try {
      await loginUser(data);
      setState({ status: "success" });

      setTimeout(() => router.push("/shows"), 1000);
    } catch (error) {
      if (error instanceof AxiosError) {
        setState({
          status: "error",
          error: error.response?.data.message || "An error occurred",
        });

        return;
      }

      setState({ status: "error", error: "An error occurred" });
    }
  };

  return (
    <form
      className="w-full max-w-sm rounded p-4 sm:min-w-sm sm:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <StyledInput
          label="E-mail"
          id="email"
          type="text"
          {...register("email")}
          errors={errors.email?.message}
        />

        <StyledInput
          label="Password"
          id="password"
          type="password"
          {...register("password")}
          errors={errors.password?.message}
        />

        {state && (
          <FormFeedback
            status={state.status}
            errorMessage={state.error}
            successMessage="Login successful! Redirecting..."
          />
        )}

        <footer className="flex flex-col gap-4 text-sm">
          <Link href="/register" className="text-end underline hover:text-purple-700">
            You don&apos;t have an account?
          </Link>
          <button
            type="submit"
            className="w-full rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700"
          >
            Log In
          </button>
        </footer>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import StyledInput from "../_ui/components/forms/StyledInput";
import { IRegisterRequest } from "../_models/requests/auth-req.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../_utils/schemas/user.schema";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import FormFeedback, { IFormFeedbackProps } from "../_ui/components/forms/FormFeedback";
import { AxiosError } from "axios";
import { useAuth } from "../_context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const {
    register: registerInput,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const [state, setState] = useState<{
    error?: string;
    status: IFormFeedbackProps["status"];
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/shows");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: IRegisterRequest) => {
    setState({ status: "loading" });
    try {
      await registerUser(data);
      setState({ status: "success" });
      // Redirect to home or dashboard after successful registration
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
          label="Name"
          id="name"
          {...registerInput("name")}
          errors={errors.name?.message}
        />

        <StyledInput
          label="E-mail"
          id="email"
          type="email"
          {...registerInput("email")}
          errors={errors.email?.message}
        />

        <StyledInput
          label="Phone Number"
          id="phone"
          type="phone"
          {...registerInput("phone")}
          errors={errors.phone?.message}
        />

        <StyledInput
          label="Password"
          id="password"
          type="password"
          {...registerInput("password")}
          errors={errors.password?.message}
        />

        {state && (
          <FormFeedback
            status={state.status}
            errorMessage={state.error}
            successMessage="Registration successful! Redirecting..."
          />
        )}

        <footer className="flex flex-col gap-4 text-sm">
          <Link href="/" className="text-end underline hover:text-purple-700">
            Already have an account?
          </Link>
          <button
            type="submit"
            className="w-full rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700"
          >
            Register
          </button>
        </footer>
      </div>
    </form>
  );
}

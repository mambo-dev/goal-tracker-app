"use client";
import useError from "@/components/hooks/error";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { resetPassword } from "@/lib/api-calls/account/forgot-password";
import { updatePasswordSchema } from "@/lib/schemas";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type Props = {};

export default function ResetPasswordForm({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const resetCode = params.get("resetCode");
  const email = params.get("email");
  const [initialState, setInitialState] = useState({
    password: "",
    confirmPassword: "",
    resetCode: resetCode ?? "",
  });
  const router = useRouter();
  const { handleError } = useError();
  const [viewable, setViewable] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setInitialState({ ...initialState, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e: React.FormEvent) {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (!email) {
        toast({
          title: "Oops Missed a step",
          message:
            "Kindly follow the link sent to your email to rectify this error",
          type: "error",
        });

        return;
      }
      const { confirmPassword, password, resetCode } =
        updatePasswordSchema.parse({ ...initialState, email });

      await resetPassword({
        password,
        confirmPassword,
        resetCode,
        email,
      });

      toast({
        title: "Successfully  Reset password",
        message: "Redirecting you to sign in with new password",
      });

      router.push(`/#signin`);
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-full md:max-w-lg lg:max-w-md rounded-md mx-auto mt-14 bg-white shadow-md py-6 h-fit px-3 flex items-center justify-center gap-3 flex-col"
    >
      <div className="w-fit mr-auto flex flex-col space-y-1.5 text-center sm:text-left ">
        <h4 className="text-lg font-semibold leading-none tracking-tight">
          Time to update your password
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Passwords are a tricky bunch use a strong but memorable one 😉
        </p>
      </div>
      <div className="flex w-full relative">
        <Input
          value={initialState.password}
          onChange={handleChange}
          placeholder="enter your new password"
          name="password"
          type={viewable ? "text" : "password"}
        />
        <button
          type="button"
          onClick={() => setViewable(!viewable)}
          className="h-fit w-fit absolute top-3 right-3 text-slate-700"
        >
          {viewable ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </button>
      </div>

      <Input
        value={initialState.confirmPassword}
        onChange={handleChange}
        placeholder="confirm password"
        name="confirmPassword"
        type={viewable ? "text" : "password"}
      />

      <Input
        value={initialState.resetCode}
        onChange={handleChange}
        placeholder="paste the reset code"
        name="resetCode"
        type="text"
      />

      <Button isLoading={isLoading} size="default" variant="default">
        reset password
      </Button>
    </form>
  );
}

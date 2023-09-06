"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

import useError from "@/components/hooks/error";
import { requestResetSchema, twoFactorSchema } from "@/lib/schemas";
import { toast } from "@/components/ui/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyTwoFactorCode } from "@/lib/api-calls/account/two-factor";
import Paragraph from "@/components/ui/paragraph";
import Button from "@/components/ui/button";
import { requestResetPassword } from "@/lib/api-calls/account/forgot-password";

type Props = {};

export default function RequestResetForm({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useError();
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    setIsLoading(true);
    e.preventDefault();
    try {
      const { email } = requestResetSchema.parse({ email: userEmail });

      await requestResetPassword(email);

      toast({
        title: "Successfully sent Reset code",
        message: "We have sent a reset code to your email",
      });

      router.push(`/account/forgot-password/reset-password?email=${email}`);
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
          Sorry to hear you forgot your password.
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kindly enter the email you signed up with
        </p>
      </div>
      <Input
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        placeholder="enter your email"
        name="email"
      />
      <Button isLoading={isLoading} size="default" variant="default">
        send reset code
      </Button>
    </form>
  );
}

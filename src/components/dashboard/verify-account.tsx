"use client";
import React, { useState } from "react";
import { ToolTipCustom } from "../ui/tooltip";
import Modal from "../ui/modals";
import useError from "../hooks/error";
import { useRouter } from "next/navigation";
import {
  resendUserVerification,
  verifyUserEmail,
} from "@/lib/api-calls/account/verify-account";
import { Input } from "../ui/input";
import Button from "../ui/button";
import { toast } from "../ui/toast";
import { BadgeAlert, BadgeCheck } from "lucide-react";

export default function VerifyUserEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [resend, setResend] = useState(false);
  const { handleError } = useError();
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");

  async function handleResendCode() {
    setResend(true);
    try {
      await resendUserVerification();
      toast({
        type: "success",
        message: "We have sent you the code again",
        title: "New Verification code",
      });
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setResend(false);
    }
  }

  async function HandleTwoFactor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyUserEmail(verificationCode);
      toast({
        type: "success",
        message: "Thank you for veryfing your account",
        title: "Account Verified",
      });
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={HandleTwoFactor}
      className="w-full flex flex-col items-center gap-3"
    >
      <Input
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="enter valid code"
        type="text"
        name="code"
      />
      <Button variant="default" size="default" isLoading={isLoading}>
        verify account
      </Button>
      <button
        type="button"
        onClick={handleResendCode}
        className="text-xs ml-auto w-fit outline-none h-fit text-purple-500 hover:underline"
      >
        Did not receive code. {resend ? "Resending..." : "Resend"}
      </button>
    </form>
  );
}

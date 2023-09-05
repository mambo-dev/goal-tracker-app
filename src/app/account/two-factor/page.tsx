"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";
import React, { useState } from "react";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import useError from "@/components/hooks/error";
import { twoFactorSchema } from "@/lib/schemas";
import { toast } from "@/components/ui/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyTwoFactorCode } from "@/lib/api-calls/account/two-factor";

export const metadata: Metadata = {
  title: "Goalee | Two factor",
  description: "Track your goals and progress",
};

type Props = {};

export default function TwoFactorPage({}: Props) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useError();
  const router = useRouter();
  const params = useSearchParams();
  const username = params.get("username");

  async function handleSubmit(e: React.FormEvent) {
    setIsLoading(true);
    e.preventDefault();
    try {
      const { twoFactorCode } = twoFactorSchema.parse({
        twoFactorCode: code,
      });

      if (!username) {
        toast({
          type: "error",
          message: "a username is required kindly sign up first",
          title: "Oops Missed a step!",
        });
        return;
      }

      await verifyTwoFactorCode(twoFactorCode, username);
      toast({
        title: "Welcome back!",
        message: "Continue your tracking journey",
      });

      router.push("/dashboard");
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
      <div className="w-full flex text-left items-start justify-center flex-col ">
        <h1 className="text-xl text-left font-bold ">
          Two Factor Authentication
        </h1>
        <Paragraph size="sm" className="text-xs">
          Kindly enter the code sent to your email address
        </Paragraph>
      </div>
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="enter valid code"
        type="text"
        name="code"
      />
      <Button isLoading={isLoading} size="default" variant="default">
        verify code
      </Button>
    </form>
  );
}

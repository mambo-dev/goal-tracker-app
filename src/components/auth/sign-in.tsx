"use client";
import React, { useState } from "react";
import Modal from "../ui/modals";
import Button from "../ui/button";
import { useRouter } from "next/navigation";
import useError from "../hooks/error";
import { signInSchema } from "@/lib/schemas";
import { toast } from "../ui/toast";
import { Input } from "../ui/input";
import signIn from "@/lib/api-calls/auth/sign-in";

type Props = {};

export default function SignIn({}: Props) {
  return (
    <Modal
      button={
        <Button size="sm" variant="outline" className="w-20 shadow-none">
          Sign in
        </Button>
      }
      contentClassName="max-w-md"
      title="Welcome Back"
      description="Glad to see you back, login to access your dashboard"
    >
      <SignInForm />
    </Modal>
  );
}

function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [initialState, setInitialState] = useState({
    username: "",

    password: "",
  });
  const router = useRouter();
  const { handleError } = useError();

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
      const userDetails = signInSchema.parse(initialState);
      const { two_factor } = await signIn(userDetails);

      toast({
        title: "Welcome back!",
        message: "Continue your tracking journey",
      });

      if (two_factor) {
        router.push(`/account/two-factor?username=${userDetails.username}`);
        return;
      }

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
      className="w-full flex items-center justify-center gap-3 flex-col "
    >
      <Input
        label="Username"
        name="username"
        value={initialState.username}
        type="text"
        placeholder="enter your username"
        onChange={handleChange}
      />

      <Input
        label="Password"
        type="password"
        value={initialState.password}
        placeholder="enter a strong password"
        name="password"
        onChange={handleChange}
      />

      <Button
        size="default"
        variant="default"
        className="mt-4"
        isLoading={isLoading}
      >
        sign in
      </Button>
    </form>
  );
}

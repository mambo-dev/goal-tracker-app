"use client";
import React, { useState } from "react";
import Modal from "../ui/modals";
import { Input } from "../ui/input";
import Button from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { signUpSchema } from "@/lib/schemas";
import { z } from "zod";
import signUp from "@/lib/api-calls/auth/sign-up";
import { HandleError } from "@/lib/types";
import useError from "../hooks/error";

type Props = {};

export default function SignUp({}: Props) {
  return (
    <Modal
      button={
        <Button
          size="default"
          variant="default"
          className="w-28  shadow-md shadow-purple-300"
        >
          Sign up
        </Button>
      }
      contentClassName="max-w-md"
      title="Welcome To Goalee"
      description="Glad to see you join us, fill in the details below to get started"
    >
      <SignUpForm />
    </Modal>
  );
}

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [initialState, setInitialState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      const userDetails = signUpSchema.parse(initialState);

      await signUp(userDetails);

      toast({
        title: "Welcome to Goalee",
        message: "Thank you for joining us",
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
        label="Email"
        name="email"
        type="email"
        value={initialState.email}
        placeholder="enter your email"
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
      <Input
        label="Confirm password"
        type="password"
        value={initialState.confirmPassword}
        placeholder="enter a confirmation password"
        name="confirmPassword"
        onChange={handleChange}
      />
      <Button
        size="default"
        variant="default"
        className="mt-4"
        isLoading={isLoading}
      >
        sign up
      </Button>
    </form>
  );
}

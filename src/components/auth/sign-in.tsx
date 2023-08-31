"use client";
import React from "react";
import Modal from "../ui/modals";
import Button from "../ui/button";

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
  return <div>sign in this damn app</div>;
}

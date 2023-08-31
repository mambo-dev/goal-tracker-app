"use client";
import React from "react";
import Modal from "../ui/modals";

type Props = {};

export default function SignIn({}: Props) {
  return (
    <Modal
      button={<button>sign in</button>}
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

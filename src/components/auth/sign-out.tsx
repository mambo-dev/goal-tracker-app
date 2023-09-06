"use client";
import React, { useState } from "react";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { useSignOut } from "../hooks/signout";

type Props = {};

export default function SignOut({}: Props) {
  const { isLoading, signOut } = useSignOut();
  return (
    <button
      onClick={signOut}
      className="text-sm text-orange-900 py-2 px-4 bg-orange-200 font-medium inline-flex h-10 items-center justify-center rounded-md focus:shadow-orange-200 shadow-md shadow-orange-100  "
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Sign out
    </button>
  );
}

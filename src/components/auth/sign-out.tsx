"use client";
import React, { useState } from "react";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

type Props = {};

export default function SignOut({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const signOut = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/auth/signout`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      toast({
        type: "success",
        title: "Good Bye 👋",
        message: "can't wait to see you again. ",
        duration: 2000,
      });

      router.refresh();
    } catch (error) {
      toast({
        type: "error",
        title: "Ooops!",
        message: "failed to log you out try again",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={signOut}
      className="text-sm text-orange-900 py-2 px-4 bg-orange-200 font-medium inline-flex h-10 items-center justify-center rounded-md focus:shadow-orange-300 shadow-md shadow-orange-100  "
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

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";

export function useSignOut() {
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
        duration: 1000,
      });

      router.push("/");
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
  return {
    isLoading,

    signOut,
  };
}

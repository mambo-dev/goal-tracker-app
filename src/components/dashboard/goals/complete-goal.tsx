"use client";
import useError from "@/components/hooks/error";
import { toast } from "@/components/ui/toast";
import { setAchieved } from "@/lib/api-calls/goals/goal";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  completed: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  goalId: number;
};

export default function CompleteGoal({
  completed,
  setCompleted,
  goalId,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { handleError } = useError();

  async function handleClick() {
    setIsLoading(true);
    try {
      if (isLoading) {
        toast({
          type: "default",
          message: "Give it a moment...",
          duration: 1000,
        });
      }

      await setAchieved(goalId);

      toast({
        type: "success",
        title: "Great Job",
        message: "Good job on achieving your goal",
        duration: 1000,
      });

      router.refresh();
      setCompleted(!completed);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={` inline-flex items-center justify-center h-full w-full border-2 ${
        completed
          ? "border-green-500 text-green-700"
          : "border-slate-400 text-slate-700"
      } rounded-full`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        completed && <Check className="h-4 w-4" />
      )}
    </button>
  );
}

"use client";
import useError from "@/components/hooks/error";
import { AlertDialogComponent } from "@/components/ui/alert-dialog-comp";
import Modal from "@/components/ui/modals";
import { toast } from "@/components/ui/toast";
import { setAchieved } from "@/lib/api-calls/goals/goal";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  goalId: number;
};

export default function CompleteGoal({ goalId }: Props) {
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
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialogComponent
      title="Are you sure ?"
      description="Once you mark this goal as achieved we will delete it from our database"
      trigger={
        <button
          className={`inline-flex items-center justify-center h-full w-full border-2  focus:border-green-500 focus:text-green-700 rounded-full border-slate-400 text-slate-700  `}
        />
      }
      action={
        <button
          onClick={handleClick}
          className="h-10 py-2 px-4 bg-red-500 text-slate-100 inline-flex items-center justify-center gap-2    font-medium  "
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} continue
        </button>
      }
    />
  );
}

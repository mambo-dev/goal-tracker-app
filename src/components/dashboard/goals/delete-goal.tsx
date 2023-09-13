"use client";
import useError from "@/components/hooks/error";
import { AlertDialogComponent } from "@/components/ui/alert-dialog-comp";
import { toast } from "@/components/ui/toast";
import { deleteGoal } from "@/lib/api-calls/goals/goal";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  goalId: number;
};

export default function DeleteGoal({ goalId }: Props) {
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

      await deleteGoal(goalId);

      toast({
        type: "success",
        title: "Goal Deleted",
        message: "Succesfully delete your goal",
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
      description="Deleting a goal will also delete your targets. This action cannot be undone"
      trigger={
        <button className="inline-flex items-center justify-cente r outline-none">
          <Trash2 className="h-5 w-5 text-red-300 hover:text-red-500" />
        </button>
      }
      action={
        <button
          onClick={handleClick}
          className="h-10 py-2 px-4 bg-red-500 text-slate-100 inline-flex items-center justify-center gap-2    font-medium  "
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} delete
        </button>
      }
    />
  );
}

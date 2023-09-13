"use client";

import useError from "@/components/hooks/error";
import Button from "@/components/ui/button";
import DatePickerComponent from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { editGoal } from "@/lib/api-calls/goals/goal";
import { editGoalSchema } from "@/lib/schemas";
import { Goal, Type } from "@prisma/client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function UpdateGoalForm({ goal }: { goal: Goal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasTimeline, setHasTimeline] = useState<boolean>(
    goal.goal_timeline ? true : false
  );
  const [hasDescription, setHasDescription] = useState<boolean>(
    goal.goal_description ? true : false
  );
  const [timeLine, setTimeline] = useState<Date | undefined>(
    goal.goal_timeline ? goal.goal_timeline : new Date()
  );
  const [initialState, setInitialState] = useState({
    title: goal.goal_title,
    description: goal.goal_description ? goal.goal_description : "",
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const goalInput = editGoalSchema.parse({
        goalTitle: initialState.title,
        goalDescription: initialState.description,
        goalTimeline: hasTimeline ? timeLine : undefined,
      });

      await editGoal({
        goalDetails: goalInput,
        goalId: goal.goal_id,
      });

      toast({
        message: "succesfully updated this details.",
        duration: 1000,
        title: "Updated details,",
        type: "success",
      });

      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }
  // goalTitle, goalType, goalUserTimeline

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-full gap-2"
    >
      <Input
        value={initialState.title}
        onChange={handleChange}
        name="title"
        label="Title"
        placeholder="enter title for your goal"
      />

      {!hasDescription && (
        <div className="w-fit mr-auto flex flex-col space-y-1.5 text-left  gap-2 ">
          <h4 className="text-sm font-semibold leading-none tracking-tight">
            Description
          </h4>
          <div className="flex items-start justify-center gap-1 ">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              want to add a description for your goal?
            </p>
            <button
              onClick={() => setHasDescription(true)}
              className="text-xs outline-none focus:outline-none hover:underline text-purple-500 hover:text-purple-600"
            >
              yes.
            </button>
          </div>
        </div>
      )}

      {hasDescription && (
        <div className="flex w-full relative">
          <Input
            value={initialState.description}
            onChange={handleChange}
            label="Description"
            name="description"
            placeholder="if neccesary you can add a description too"
          />
          <button
            type="button"
            onClick={() => setHasDescription(false)}
            className="h-fit w-fit absolute  right-3 text-slate-700 hover:animate-accordion-up "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!hasTimeline && (
        <div className="w-fit mr-auto flex flex-col space-y-1.5  text-left gap-2 ">
          <h4 className="text-sm font-semibold leading-none tracking-tight">
            Date to complete
          </h4>
          <div className="flex items-start justify-center gap-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              want to add a day to complete this goal?
            </p>
            <button
              onClick={() => setHasTimeline(true)}
              className="text-xs outline-none focus:outline-none  hover:underline  text-purple-500 hover:text-purple-600"
            >
              yes.
            </button>
          </div>
        </div>
      )}

      {hasTimeline && (
        <div className="flex w-full relative">
          <DatePickerComponent
            date={timeLine}
            setDate={setTimeline}
            label="Date"
          />
          <button
            type="button"
            onClick={() => setHasTimeline(false)}
            className="h-fit w-fit absolute  right-3 text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Button
        size="default"
        variant="default"
        className="mt-4"
        isLoading={isLoading}
      >
        update goal
      </Button>
    </form>
  );
}

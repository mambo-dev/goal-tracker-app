"use client";
import useError from "@/components/hooks/error";
import { Input } from "@/components/ui/input";
import { SelectMenu } from "@/components/ui/select-menu";
import { toast } from "@/components/ui/toast";
import createGoal from "@/lib/api-calls/goals/goal";
import { createGoalSchema } from "@/lib/schemas";
import { Type } from "@prisma/client";
import React, { useState } from "react";
import DatePickerComponent from "../../ui/date-picker";
import { assignTimeline } from "@/app/api/goals/validatetype";

export default function AddGoalForm() {
  const [timeLine, setTimeLine] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Type>("daily");

  const { handleError } = useError();

  const options = [
    { value: "daily", display: "Daily" },
    { value: "weekly", display: "Weekly" },
    { value: "monthly", display: "Monthly" },
    { value: "yearly", display: "Yearly" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const goalInput = createGoalSchema.parse({
        goalTitle: title,
        goalUserTimeline: timeLine,
        goalType: type,
      });

      await createGoal(goalInput);

      toast({
        message: "Succesfully added your new goal",
        duration: 1000,
        title: "New goal added",
        type: "success",
      });
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Title"
        placeholder="enter title for your goal"
      />

      <SelectMenu
        placeholder={`This goal is a ${type} goal`}
        options={options}
        label="Type"
        value={type}
        setValue={setType}
      />
    </form>
  );
}

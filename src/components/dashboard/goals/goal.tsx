"use client";
import { GoalsWithSubGoals } from "@/lib/types";
import { Goal } from "@prisma/client";
import React from "react";

type Props = {
  goal: GoalsWithSubGoals;
};

export default function DisplayGoal({ goal }: Props) {
  return (
    <div className=" p-2 rounded-lg shadow border border-gray-300 w-full flex items-start jusify-center flex-col ">
      <h4 className="text-lg font-semibold leading-none tracking-tight first-letter:uppercase ">
        {goal.goal_title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        you have 0 out of 0 subgoals left to mark this goal complete
      </p>
    </div>
  );
}

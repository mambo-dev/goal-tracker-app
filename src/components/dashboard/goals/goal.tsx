"use client";
import { format, sub } from "date-fns";
import React, { useState } from "react";
import CompleteGoal from "./complete-goal";
import { Goal } from "@prisma/client";

type Props = {
  goal: Goal;
};

export default function DisplayGoal({ goal }: Props) {
  const [completed, setCompleted] = useState(goal.goal_achieved);
  return (
    <div className="p-2 rounded-lg shadow border border-gray-300 w-full flex gap-2 items-start jusify-center">
      <div className="mt-0 w-5 h-5">
        <CompleteGoal
          completed={completed}
          setCompleted={setCompleted}
          goalId={goal.goal_id}
        />
      </div>
      <div className=" flex flex-1 items-start jusify-center flex-col ">
        <div className="w-fit h-fit relative">
          <h4
            className={`text-md font-semibold leading-none tracking-tight first-letter:uppercase ${
              goal.goal_achieved && "text-slate-700"
            }`}
          >
            {goal.goal_title}
          </h4>
          {goal.goal_achieved && (
            <div className="border-b border-slate-700 absolute top-2 left-0 right-0" />
          )}
        </div>

        <span className="text-slate-700 font-bold text-sm">
          {format(new Date(goal.goal_type_timeline), "Pp")}
        </span>
      </div>
    </div>
  );
}

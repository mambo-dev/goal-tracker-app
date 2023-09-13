"use client";
import { format, sub } from "date-fns";
import React, { useState } from "react";
import CompleteGoal from "./complete-goal";
import { Goal } from "@prisma/client";
import DeleteGoal from "./delete-goal";
import UpdateGoal from "./update-goal-details";
import { truncate } from "../../../lib/utils";
import Link from "next/link";

type Props = {
  goal: Goal;
};

export default function DisplayGoal({ goal }: Props) {
  return (
    <div className="group hover:cursor-pointer p-2 rounded-lg shadow border border-gray-300 w-full h-full flex gap-2 items-start jusify-center">
      <div className=" flex flex-1 items-start jusify-center flex-col ">
        <div className="w-full flex items-center justify-between h-fit relative">
          <Link
            href={`goals/${goal.goal_id}`}
            className={`group-hover:underline group-hover:text-purple-500 text-md font-semibold leading-none tracking-tight first-letter:uppercase ${
              goal.goal_achieved && "text-slate-700"
            }`}
          >
            {goal.goal_title}
          </Link>

          <div className="mt-0  flex items-center gap-2 justify-center">
            <UpdateGoal goal={goal} />
            <DeleteGoal goalId={goal.goal_id} />
            <CompleteGoal goalId={goal.goal_id} />
          </div>
        </div>
        {goal.goal_description && (
          <p className="text-sm font-medium first-letter:uppercase text-slate-700">
            {truncate(goal.goal_description, 85)}
          </p>
        )}
        {goal.goal_timeline && (
          <span className="text-slate-700 font-bold text-sm">
            {format(new Date(goal.goal_timeline), "Pp")}
          </span>
        )}
      </div>
    </div>
  );
}

// {goal.goal_achieved && (
//   <div className="border-b border-slate-700 absolute top-2 left-0 right-0" />
// )}

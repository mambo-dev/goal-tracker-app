import { Goal } from "@prisma/client";

import React from "react";
import DisplayGoal from "./goal";
import { GoalsWithSubGoals } from "@/lib/types";

type Props = {
  goals: GoalsWithSubGoals[];
};

export default function DisplayGoals({ goals }: Props) {
  return (
    <div className="container w-full gap-4 h-full py-4 grid grid-cols-3">
      {goals.map((goal) => {
        return <DisplayGoal key={goal.goal_id} goal={goal} />;
      })}
    </div>
  );
}

import { Goal } from "@prisma/client";

import React from "react";
import DisplayGoal from "./goal";
import EmptyState from "@/components/ui/empty";
import { Trophy } from "lucide-react";
import AddGoal from "./add-goal";

type Props = {
  goals: Goal[];
};

export default function DisplayGoals({ goals }: Props) {
  if (!goals || goals.length <= 0) {
    return (
      <div className="mx-auto mt-20">
        <EmptyState
          icon={<Trophy className="h-10 w-10" />}
          subTitle="You currently have no goals.. start creating your first goal"
          title="Create Goal"
          action={<AddGoal />}
        />
      </div>
    );
  }

  return (
    <div className="px-2 md:container w-full gap-4 h-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {goals.map((goal) => {
        return <DisplayGoal key={goal.goal_id} goal={goal} />;
      })}
    </div>
  );
}

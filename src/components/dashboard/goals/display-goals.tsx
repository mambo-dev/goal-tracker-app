import { Goal } from "@prisma/client";

import React from "react";
import DisplayGoal from "./goal";
import EmptyState from "@/components/ui/empty";
import { Target } from "lucide-react";
import AddGoal from "./add-goal";

type Props = {
  goals: Goal[];
};

export default function DisplayGoals({ goals }: Props) {
  return (
    <div className="px-2 md:container w-full gap-4 h-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {goals && goals.length > 0 ? (
        goals.map((goal) => {
          return <DisplayGoal key={goal.goal_id} goal={goal} />;
        })
      ) : (
        <EmptyState
          icon={<Target className="h-10 w-10" />}
          subTitle="You currently have no goals create more"
          title="Create Goal"
          action={<AddGoal />}
        />
      )}
    </div>
  );
}

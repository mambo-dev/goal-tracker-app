import { Progress } from "@/components/ui/progress";
import { TargetWithTasks } from "@/lib/types";
import { TargetTasks, GoalTarget as TargetType } from "@prisma/client";
import React from "react";

type Props = {
  target: TargetWithTasks;
};

export default function GoalTarget({ target }: Props) {
  return (
    <div className="py-1 px-2">
      <p className="font-medium text-sm text-slate-800 first-letter:uppercase">
        {target.goal_target_name}
      </p>

      <DisplayTargetProgress target={target} />
    </div>
  );
}

function DisplayTargetProgress({ target }: { target: TargetWithTasks }) {
  switch (target.goal_target_type) {
    case "curency":
      console.log(!target.goal_current_value);
      if (
        typeof target.goal_current_value !== "number" ||
        typeof target.goal_target_value !== "number"
      ) {
        return <div>no progress to display</div>;
      }

      return (
        <div className="flex items-center gap-2 text-sm ">
          <span className="text-slate-700 font-semibold">
            {Math.floor(target.goal_current_value)}/
            {Math.floor(target.goal_target_value)}
          </span>
          <Progress
            value={Math.floor(
              (target.goal_current_value / target.goal_target_value) * 100
            )}
          />
        </div>
      );
    case "number":
      if (
        typeof target.goal_current_value !== "number" ||
        typeof target.goal_target_value !== "number"
      ) {
        return <div>no progress to display</div>;
      }

      return (
        <div className="flex items-center gap-2 text-sm ">
          <Progress
            value={Math.floor(
              (target.goal_current_value / target.goal_target_value) * 100
            )}
          />
          <span className="text-slate-700 font-semibold">
            {Math.floor(target.goal_current_value)}/
            {Math.floor(target.goal_target_value)}
          </span>
        </div>
      );
    case "done_not_done":
      if (typeof target.goal_target_achieved !== "boolean") {
        return <div>no progress to display</div>;
      }

      return (
        <div className="flex items-center gap-2 text-sm ">
          <Progress value={target.goal_target_achieved ? 100 : 0} />
          <span className="text-slate-700 font-semibold">0/1</span>
        </div>
      );

    case "milestone":
      const tasksCompleted = target.goal_target_tasks.filter(
        (task) => task.target_task_achieved
      ).length;
      const totalTasks = target.goal_target_tasks.length;
      const percentageCompleted = Math.floor(
        (tasksCompleted / totalTasks) * 100
      );
      return (
        <div className="flex items-center gap-2 text-sm ">
          <Progress value={percentageCompleted} />
          <span className="text-slate-700 font-semibold">
            {tasksCompleted}/{totalTasks}
          </span>
        </div>
      );
    default:
      return <p>something went horribly wrong</p>;
  }
}

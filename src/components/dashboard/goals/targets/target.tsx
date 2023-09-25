import Modal from "@/components/ui/modals";
import { Progress } from "@/components/ui/progress";
import { TargetWithTasks } from "@/lib/types";
import { TargetTasks, GoalTarget as TargetType } from "@prisma/client";
import React from "react";
import UpdateTarget from "./update-target";

type Props = {
  target: TargetWithTasks;
};

export default function GoalTarget({ target }: Props) {
  return <DisplayTargetProgress target={target} />;
}

function DisplayTargetProgress({ target }: { target: TargetWithTasks }) {
  let percentageCompleted: number = 0;
  switch (target.goal_target_type) {
    case "curency":
      console.log(!target.goal_current_value);
      if (
        typeof target.goal_current_value !== "number" ||
        typeof target.goal_target_value !== "number"
      ) {
        return <div>no progress to display</div>;
      }

      const targetCurrencyValue = target.goal_target_value;
      const currentCurrencyValue = target.goal_current_value;
      percentageCompleted = Math.floor(
        (currentCurrencyValue / targetCurrencyValue) * 100
      );

      return (
        <DisplayProgressAndGaps
          name={target.goal_target_name}
          current={currentCurrencyValue}
          total={targetCurrencyValue}
          percentageCompleted={percentageCompleted}
          target={target}
        />
      );
    case "number":
      if (
        typeof target.goal_current_value !== "number" ||
        typeof target.goal_target_value !== "number"
      ) {
        return <div>no progress to display</div>;
      }

      const targetValue = target.goal_target_value;
      const currentValue = target.goal_current_value;
      percentageCompleted = Math.floor((currentValue / targetValue) * 100);

      return (
        <DisplayProgressAndGaps
          name={target.goal_target_name}
          current={currentValue}
          total={targetValue}
          percentageCompleted={percentageCompleted}
          target={target}
        />
      );
    case "done_not_done":
      if (typeof target.goal_target_achieved !== "boolean") {
        return <div>no progress to display</div>;
      }

      return (
        <DisplayProgressAndGaps
          name={target.goal_target_name}
          current={target.goal_target_achieved ? 1 : 0}
          total={1}
          percentageCompleted={target.goal_target_achieved ? 100 : 0}
          target={target}
        />
      );

    case "milestone":
      const tasksCompleted = target.goal_target_tasks.filter(
        (task) => task.target_task_achieved
      ).length;
      const totalTasks = target.goal_target_tasks.length;
      percentageCompleted = Math.floor((tasksCompleted / totalTasks) * 100);
      return (
        <DisplayProgressAndGaps
          name={target.goal_target_name}
          current={tasksCompleted}
          total={totalTasks}
          percentageCompleted={percentageCompleted}
          target={target}
        />
      );
    default:
      return <p>something went horribly wrong</p>;
  }
}

function DisplayProgressAndGaps({
  percentageCompleted,
  total,
  current,
  name,
  target,
}: {
  percentageCompleted: number;
  total: number;
  current: number;
  name: string;
  target: TargetWithTasks;
}) {
  return (
    <Modal
      contentClassName="max-w-lg"
      title="Update Target"
      button={
        <button className=" hover:bg-neutral-100 outline-none flex flex-col h-14 justify-between gap-2 text-sm py-1 px-2  w-full">
          <div className="flex w-full items-center justify-between">
            <p className="font-medium text-sm text-slate-800 first-letter:uppercase">
              {name}
            </p>
            <span className="text-slate-700 font-medium  text-xs">
              {current}/{total}
            </span>
          </div>

          <Progress value={percentageCompleted} />
        </button>
      }
    >
      <UpdateTarget target={target} />
    </Modal>
  );
}

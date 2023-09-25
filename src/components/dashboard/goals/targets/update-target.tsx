import { Progress } from "@/components/ui/progress";
import { TargetWithTasks } from "@/lib/types";
import { getPercentageValue } from "@/lib/utils";
import { Target } from "@prisma/client";
import React from "react";
import Number from "./targets/number";
import Currency from "./targets/currency";
import DoneNotDone from "./targets/DoneNotDone";
import MileStone from "./targets/milestone";

type Props = {
  target: TargetWithTasks;
};

export default function UpdateTarget({ target }: Props) {
  const percentageValue = getPercentageValue(target);

  return (
    <div className="w-full flex flex-col items-center gap-1">
      <div className=" flex flex-col  justify-between gap-2 text-sm py-1 px-2  w-full">
        <div className="flex w-full items-center justify-between">
          <p className="font-medium text-sm text-slate-800 first-letter:uppercase">
            {target.goal_target_name}
          </p>
          <span className="text-slate-700 font-medium  text-xs">
            {percentageValue.currentValue}/{percentageValue.targetValue}
          </span>
        </div>
        <span className="text-sm mx-auto font-semibold text-slate-700">
          {percentageValue.percentageCompleted}%
        </span>
        <Progress value={percentageValue.percentageCompleted} />
      </div>
      <DisplayTargetForms target={target} />
    </div>
  );
}

function DisplayTargetForms({ target }: { target: TargetWithTasks }) {
  switch (target.goal_target_type) {
    case "number":
      return <Number />;
    case "curency":
      return <Currency />;
    case "milestone":
      return <MileStone />;
    case "done_not_done":
      return <DoneNotDone />;
    default:
      return <div>error</div>;
  }
}

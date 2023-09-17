"use client";
import CircularProgress from "@/components/ui/circular-progress";
import EmptyState from "@/components/ui/empty";
import Paragraph from "@/components/ui/paragraph";
import { ProgressComponent } from "@/components/ui/progress-comp";
import { SingleGoal } from "@/lib/types";
import { getGoalProgress } from "@/lib/utils";
import { Target } from "lucide-react";
import React from "react";
import NewTarget from "./targets/new-target";
import { format } from "date-fns";

type Props = {
  goal: SingleGoal;
};

export default function GoalPage({ goal }: Props) {
  const achievedTargets = goal.goal_targets.filter(
    (target) => target.goal_target_achieved
  ).length;

  const totalTargets = goal.goal_targets.length;

  const progress = getGoalProgress(totalTargets, achievedTargets);
  return (
    <div className="max-w-2xl flex flex-col gap-10  mn-h-screen mx-auto mt-10  ">
      <div className="w-full border border-gray-300 shadow py-2 px-2 rounded-md">
        <div className="w-full flex items-center justify-center">
          <CircularProgress
            percentage={progress}
            circleWidth={80}
            radius={30}
            strokeWidth={5}
          />
          <div className="w-full mb-0 flex items-start justify-end flex-col  h-fit relative">
            <h3
              className={`group-hover:underline group-hover:text-purple-500 text-md font-semibold leading-none tracking-tight first-letter:uppercase ${
                goal.goal_achieved && "text-slate-700"
              }`}
            >
              {goal.goal_title}
            </h3>
            {goal.goal_description && (
              <p className="first-letter:uppercase text-sm text-slate-500 font-medium">
                {goal.goal_description}
              </p>
            )}
            {goal.goal_timeline && (
              <span className="text-slate-700 font-bold text-sm">
                {format(new Date(goal.goal_timeline), "Pp")}
              </span>
            )}
          </div>
        </div>
      </div>
      {goal.goal_targets && goal.goal_targets.length > 0 ? (
        <div className="w-full border border-gray-300 shadow py-2 px-2 divide-y divide-gray-200 rounded-md ">
          {goal.goal_targets &&
            goal.goal_targets.map((target) => {
              return <div key={target.goal_target_id}>my targets</div>;
            })}
        </div>
      ) : (
        <EmptyState
          icon={<Target className="w-10 h-10 text-slate-600" />}
          action={<NewTarget />}
          title="Create Your goal targets"
          subTitle="Targets are specific and measurable pieces that must be accomplished in order to reach your Goal"
        />
      )}
    </div>
  );
}

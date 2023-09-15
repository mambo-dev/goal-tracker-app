"use client";
import CircularProgress from "@/components/ui/circular-progress";
import { ProgressComponent } from "@/components/ui/progress-comp";
import { SingleGoal } from "@/lib/types";
import React from "react";

type Props = {
  goal: SingleGoal;
};

export default function GoalPage({ goal }: Props) {
  const progress = 70;
  return (
    <div className="container mx-auto mt-10">
      <CircularProgress
        percentage={progress}
        circleWidth={80}
        radius={30}
        strokeWidth={5}
      />
    </div>
  );
}

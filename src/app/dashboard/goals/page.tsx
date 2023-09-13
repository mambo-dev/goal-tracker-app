import DisplayGoals from "@/components/dashboard/goals/display-goals";
import { getAllGoals } from "@/lib/utils";
import React from "react";

type Props = {};

export default async function DailyGoalsPage({}: Props) {
  const goals = await getAllGoals();

  return <DisplayGoals goals={goals} />;
}

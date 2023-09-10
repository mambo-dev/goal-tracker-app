import DisplayGoals from "@/components/dashboard/goals/display-goals";
import { getGoalsByType } from "@/lib/utils";
import React from "react";

type Props = {};

export default async function DailyGoalsPage({}: Props) {
  const goals = await getGoalsByType("daily");

  return <DisplayGoals goals={goals} />;
}

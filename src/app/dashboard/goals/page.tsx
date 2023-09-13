import DisplayGoals from "@/components/dashboard/goals/display-goals";
import { userExistsAndAuthorized } from "@/lib/auth";
import { getAllGoals } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export default async function GoalsPage({}: Props) {
  const { user } = await userExistsAndAuthorized();

  if (!user) {
    redirect("/");
  }

  const goals = await getAllGoals(user.user_id);

  return <DisplayGoals goals={goals} />;
}

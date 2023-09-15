import { getIdFromDynamicRoute, getSingleGoal } from "@/lib/utils";
import HandleError from "./error";
import GoalPage from "@/components/dashboard/goals/goal-page";

export default async function GoalsPage({
  params,
}: {
  params: { gid: string };
}) {
  const goalId = getIdFromDynamicRoute(params.gid);

  if (!goalId) {
    throw new Error("This goal id is invalid");
  }

  const goal = await getSingleGoal(goalId);

  if (!goal) {
    throw new Error("Did not find goal! it may have been deleted or moved");
  }

  return <GoalPage goal={goal} />;
}

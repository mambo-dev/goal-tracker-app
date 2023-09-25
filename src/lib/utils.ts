import { Goal, GoalTarget, Prisma, Target, Type } from "@prisma/client";
import { db } from "./prisma";
import {
  SingleGoal,
  SingleGoalWithTargetsAndTasks,
  TargetWithTasks,
} from "./types";

export function getIdFromParams(paramName: string, url: string) {
  const { searchParams } = new URL(url);
  const id = searchParams.get(paramName);
  if (!id || isNaN(Number(id))) {
    throw new Error("invalid id value sent");
  }

  return Number(id);
}

export function getIdFromDynamicRoute(slug: string) {
  if (!slug || isNaN(Number(slug))) {
    return false;
  }
  return Number(slug);
}

export function getWebUrl() {
  if (!process.env.WEB_URL) {
    throw new Error("set the current web url");
  }
  return process.env.WEB_URL;
}

export async function getAllGoals(userId: number): Promise<Goal[]> {
  try {
    const goals = await db.goal.findMany({
      where: {
        goal_user_id: userId,
      },
    });

    return goals;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getSingleGoal(
  goalId: number
): Promise<SingleGoalWithTargetsAndTasks | null> {
  try {
    const goal = await db.goal.findUnique({
      where: {
        goal_id: goalId,
      },
      include: {
        goal_targets: {
          orderBy: {
            goal_target_date: "asc",
          },
          include: {
            goal_target_tasks: true,
          },
        },
      },
    });

    return goal;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}

export function getGoalProgress(totalTargets: number, totalAchieved: number) {
  if (totalAchieved <= 0 || totalTargets <= 0) {
    return 0;
  }
  return Math.floor((totalAchieved / totalTargets) * 100);
}

export function getPercentageValue(target: TargetWithTasks) {
  let targetValue = target.goal_target_value;
  let currentValue = target.goal_current_value;

  let percentageCompleted = 0;
  switch (target.goal_target_type) {
    case "number":
      if (typeof targetValue !== "number" || typeof currentValue !== "number") {
        throw new Error("invalid target value");
      }
      percentageCompleted = Math.floor((currentValue / targetValue) * 100);

      return {
        percentageCompleted,
        targetValue,
        currentValue,
      };
    case "curency":
      if (typeof targetValue !== "number" || typeof currentValue !== "number") {
        throw new Error("invalid target value");
      }
      percentageCompleted = Math.floor((currentValue / targetValue) * 100);
      return {
        percentageCompleted,
        targetValue,
        currentValue,
      };
    case "milestone":
      const tasksCompleted = target.goal_target_tasks.filter(
        (task) => task.target_task_achieved
      ).length;
      const totalTasks = target.goal_target_tasks.length;
      percentageCompleted = Math.floor((tasksCompleted / totalTasks) * 100);

      return {
        percentageCompleted,
        targetValue,
        currentValue,
      };
    case "done_not_done":
      currentValue = target.goal_target_achieved ? 1 : 0;
      targetValue = 1;

      percentageCompleted = target.goal_target_achieved ? 100 : 0;
      return {
        percentageCompleted,
        targetValue,
        currentValue,
      };
  }
}

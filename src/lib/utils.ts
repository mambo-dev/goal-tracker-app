import { Goal, GoalTarget, Prisma, Target, Type } from "@prisma/client";
import { db } from "./prisma";
import {
  SingleGoal,
  SingleGoalWithTargetsAndTasks,
  TargetWithTasks,
} from "./types";
import { isWithinInterval, sub } from "date-fns";

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

export function getGoalProgress(goal: SingleGoalWithTargetsAndTasks) {
  const totalTargets = goal.goal_targets.length;
  const achievedTargets = goal.goal_targets.filter(
    (target) => target.goal_target_achieved
  ).length;

  // Calculate the progress of all tasks across all targets
  const totalTasks = goal.goal_targets.reduce((total, target) => {
    return total + target.goal_target_tasks.length;
  }, 0);

  const achievedTasks = goal.goal_targets.reduce((total, target) => {
    return (
      total +
      target.goal_target_tasks.filter((task) => task.target_task_achieved)
        .length
    );
  }, 0);

  // Calculate the overall progress of tasks as a percentage

  const overallTasks = totalTasks > 0 ? (achievedTasks / totalTasks) * 100 : 0;

  const totalCurrentValue = goal.goal_targets.reduce((total, target) => {
    return total + target.goal_current_value;
  }, 0);

  const totalTargetValue = goal.goal_targets.reduce((total, target) => {
    return total + target.goal_target_value;
  }, 0);

  const overallTargets =
    totalTargetValue > 0 ? (totalCurrentValue / totalTargetValue) * 100 : 0;

  const overallTotalTargets =
    totalTargets > 0 ? (achievedTargets / totalTargets) * 100 : 0;
  const taskWeight = 0.4;
  const targetWeight = 0.4;
  const achievedTargetWeight = 0.2;
  const noTargets =
    overallTasks <= 0 && overallTargets <= 0 && overallTotalTargets <= 0;

  const weightedTaskProgress =
    overallTasks <= 0 ? (noTargets ? 0 : 40) : overallTasks * taskWeight;
  const weightedTargetProgress =
    overallTargets <= 0 ? (noTargets ? 0 : 40) : overallTargets * targetWeight;
  const weightedAchievedTargetProgress =
    overallTotalTargets <= 0
      ? noTargets
        ? 0
        : 40
      : overallTotalTargets * achievedTargetWeight;
  console.log(
    weightedTaskProgress,
    weightedTargetProgress,
    weightedAchievedTargetProgress,
    overallTasks
  );
  const overallProgress =
    weightedTaskProgress +
    weightedTargetProgress +
    weightedAchievedTargetProgress;

  return Math.floor(overallProgress);
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
      console.log(tasksCompleted, totalTasks);
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

export async function updateOrCreateStreak(user_id: number) {
  try {
    // if streak does not have end time then its still running else the streak is closed and user does not have streak

    const userHasExistingStreak = await db.streak.findFirst({
      where: {
        AND: {
          streak_analytics: {
            analytics_user_id: user_id,
          },
          streak_endtime: undefined,
        },
      },
    });

    if (userHasExistingStreak) {
      const isWithin24hours = isWithinInterval(
        userHasExistingStreak.streak_updated_at,
        {
          start: sub(new Date(), { days: 1 }),
          end: new Date(),
        }
      );

      if (isWithin24hours) {
        //continue streak
        await db.streak.update({
          where: {
            streak_id: userHasExistingStreak.streak_id,
          },
          data: {
            streak_current_count:
              (userHasExistingStreak.streak_current_count += 1),
          },
        });
      } else {
        //end streak
        await db.streak.update({
          where: {
            streak_id: userHasExistingStreak.streak_id,
          },
          data: {
            streak_endtime: new Date(),
          },
        });
      }
    } else {
      await db.streak.create({
        data: {
          streak_starttime: new Date(),
          streak_type: "daily",
          streak_current_count: 1,
          streak_analytics: {
            connect: {
              analytics_user_id: user_id,
            },
          },
        },
      });
    }

    return true;
  } catch (error) {
    throw new Error("failed to update streak");
  }
}

export async function getUserStreak(user_id: number) {
  try {
    const streak = await db.streak.findFirst({
      where: {
        AND: {
          streak_analytics: {
            analytics_user_id: user_id,
          },
          streak_endtime: undefined,
        },
      },
    });

    if (!streak) {
      return 0;
    }

    return streak.streak_current_count;
  } catch (error) {
    throw new Error("could not update streak");
  }
}

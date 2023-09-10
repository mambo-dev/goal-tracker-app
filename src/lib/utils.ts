import { Goal, Prisma, SubGoal, Type } from "@prisma/client";
import { db } from "./prisma";
import { GoalsWithSubGoals } from "./types";

export function getIdFromParams(paramName: string, url: string) {
  const { searchParams } = new URL(url);
  const id = searchParams.get(paramName);
  if (!id || isNaN(Number(id))) {
    throw new Error("invalid id value sent");
  }

  return Number(id);
}

export function getWebUrl() {
  if (!process.env.WEB_URL) {
    throw new Error("set the current web url");
  }
  return process.env.WEB_URL;
}

export async function getGoalsByType(type: Type): Promise<GoalsWithSubGoals[]> {
  try {
    const goals = await db.goal.findMany({
      where: {
        goal_type: type,
      },
      include: {
        goal_subgoals: true,
      },
    });

    return goals;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

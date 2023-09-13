import { Goal, Prisma, Type } from "@prisma/client";
import { db } from "./prisma";

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

export async function getSingleGoal(goalId: number): Promise<Goal | null> {
  try {
    const goal = await db.goal.findUnique({
      where: {
        goal_id: goalId,
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

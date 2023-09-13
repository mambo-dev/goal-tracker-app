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

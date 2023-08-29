import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getIdFromParams } from "@/lib/utils";
import { Goal } from "@prisma/client";

export async function PUT(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const goalId = getIdFromParams("goalId", request.url);
    const { user, message } = await userExistsAndAuthorized();

    if (!user) {
      return NextResponse.json(
        {
          error: [{ message }],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    const findGoal = await db.goal.findUnique({
      where: {
        goal_id: goalId,
      },
      include: {
        goal_subgoals: true,
      },
    });

    if (!findGoal) {
      return NextResponse.json(
        {
          error: [
            {
              message: "Oops this goal may have been  deleted",
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    //check whether its past the time of achievement then its too late and we end streak
    const currentTime = new Date();
    if (findGoal.goal_type_timeline > currentTime) {
      const goalHasStreak = await db.streak.findUnique({
        where: {
          streak_goal_id: findGoal.goal_id,
        },
      });

      if (goalHasStreak) {
        await db.streak.update({
          where: {
            streak_goal_id: findGoal.goal_id,
          },
          data: {
            streak_endtime: currentTime,
          },
        });
      }

      await updateGoal(findGoal.goal_id, findGoal.goal_achieved);

      return NextResponse.json(
        {
          data: true,
          okay: true,
        },
        {
          status: 200,
        }
      );
    }

    if (!findGoal.goal_achieved) {
      await updateGoal(findGoal.goal_id, findGoal.goal_achieved);
    }

    //if no subgoals just update the goal
    if (!findGoal.goal_subgoals || findGoal.goal_subgoals.length <= 0) {
      await updateOrCreateStreak(findGoal);

      return NextResponse.json(
        {
          data: true,
          okay: true,
        },
        {
          status: 200,
        }
      );
    }

    const allSubGoalsAchieved = findGoal.goal_subgoals.every((subgoal) => {
      return subgoal.subgoal_achieved;
    });

    if (!allSubGoalsAchieved) {
      return NextResponse.json(
        {
          error: [
            {
              message:
                "Oops sorry you  need to achieve all sub goals under this goal to mark it as achieved",
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    await updateOrCreateStreak(findGoal);

    return NextResponse.json(
      {
        data: true,
        okay: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error: [
          {
            message: "something went wrong with the server",
          },
        ],
        okay: false,
      },
      {
        status: 500,
      }
    );
  }
}

async function updateOrCreateStreak(goal: Goal): Promise<boolean> {
  try {
    const goalHasStreak = await db.streak.findUnique({
      where: {
        streak_goal_id: goal.goal_id,
      },
    });

    if (goalHasStreak && !goalHasStreak.streak_endtime) {
      await db.streak.update({
        where: {
          streak_id: goalHasStreak.streak_id,
        },
        data: {
          streak_current_count: (goalHasStreak.streak_current_count += 1),
        },
      });
    } else {
      await db.streak.create({
        data: {
          streak_starttime: new Date(),
          streak_type: goal.goal_type,
          streak_current_count: 1,
          streak_goal: {
            connect: {
              goal_id: goal.goal_id,
            },
          },
          streak_user: {
            connect: {
              user_id: goal.goal_user_id,
            },
          },
        },
      });
    }
    return true;
  } catch (error) {
    throw new Error("error updating streak");
  }
}

async function updateGoal(goalId: number, goalAchievement: boolean) {
  const updatedgoal = await db.goal.update({
    where: {
      goal_id: goalId,
    },
    data: {
      goal_achieved: !goalAchievement,
    },
  });
  return updatedgoal;
}

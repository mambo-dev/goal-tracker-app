import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  createTargetSchema,
  editTargetSchema,
  updateTaskSchema,
} from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { getIdFromParams, updateOrCreateStreak } from "@/lib/utils";
import { Target } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();
    const { user, message } = await userExistsAndAuthorized();

    const target_id = getIdFromParams("target_id", request.url);

    if (!user || message) {
      return NextResponse.json(
        {
          error: [
            {
              message: message ?? "user is unauthorized",
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    const findGoalTarget = await db.goalTarget.findUnique({
      where: {
        goal_target_id: target_id,
      },
    });

    if (!findGoalTarget) {
      return NextResponse.json(
        {
          error: [
            {
              message: "Oops sorry this target may have been deleted or moved",
            },
          ],
          okay: false,
        },
        {
          status: 200,
        }
      );
    }

    const { targetType, newTarget, status } = editTargetSchema.parse(body);

    if (targetType === "curency" || targetType === "number") {
      if (!newTarget) {
        return NextResponse.json(
          {
            error: [
              {
                message: "a new target is required for this",
              },
            ],
            okay: false,
          },
          {
            status: 200,
          }
        );
      }
      if (
        typeof findGoalTarget.goal_current_value !== "number" ||
        typeof findGoalTarget.goal_target_value !== "number"
      ) {
        throw new Error("no current or target value");
      }

      const newValue =
        status === "increase"
          ? (findGoalTarget.goal_current_value += newTarget)
          : (findGoalTarget.goal_current_value -= newTarget);

      const updatedGoal = await db.goalTarget.update({
        where: {
          goal_target_id: findGoalTarget.goal_target_id,
        },
        data: {
          goal_current_value: newValue,
        },
      });

      const targetAchieved = await db.goalTarget.update({
        where: {
          goal_target_id: findGoalTarget.goal_target_id,
        },
        data: {
          goal_target_achieved:
            updatedGoal.goal_current_value >= updatedGoal.goal_target_value,
        },
      });

      if (targetAchieved.goal_target_achieved) {
        await updateOrCreateStreak(user.user_id);
      }
    } else if (targetType === "done_not_done") {
      await db.goalTarget.update({
        where: {
          goal_target_id: findGoalTarget.goal_target_id,
        },
        data: {
          goal_target_achieved: true,
        },
      });

      await updateOrCreateStreak(user.user_id);
    }

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
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
          okay: false,
        },
        {
          status: 400,
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

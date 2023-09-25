import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { createTargetSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { getIdFromParams } from "@/lib/utils";
import { Target } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();
    const { user, message } = await userExistsAndAuthorized();

    const goal_id = getIdFromParams("goal_id", request.url);

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
          status: 200,
        }
      );
    }

    const {
      targetName,
      targetType,
      currencyTarget,
      doneNotDone,
      mileStones,
      numericTarget,
    } = createTargetSchema.parse(body);

    const target = await createTarget(
      goal_id,
      targetType,
      targetName,
      currencyTarget,
      doneNotDone,
      mileStones,
      numericTarget
    );

    if (typeof target === "string" || !target) {
      return NextResponse.json(
        {
          error: [
            {
              message: target ?? "unable to create this target",
            },
          ],
          okay: false,
        },
        {
          status: 200,
        }
      );
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

async function createTarget(
  goal_id: number,
  targetType: Target,
  targetName: string,
  currencyTarget:
    | {
        startValue: number;
        endValue: number;
      }
    | undefined,
  doneNotDone: boolean | undefined,
  mileStones:
    | {
        name: string;
      }[]
    | undefined,
  numericTarget:
    | {
        startValue: number;
        endValue: number;
      }
    | undefined
) {
  if (!targetType) {
    throw new Error("a target type should be provided");
  }

  switch (targetType) {
    case "curency":
      if (
        !currencyTarget ||
        !currencyTarget.startValue ||
        !currencyTarget.endValue
      ) {
        return "a currency target is required";
      }

      await db.goalTarget.create({
        data: {
          goal_target_name: targetName,
          goal_target_type: targetType,
          goal_current_value: currencyTarget.startValue,
          goal_target_value: currencyTarget.endValue,
          goal_target_achieved: false,
          goal_target_goal: {
            connect: {
              goal_id: goal_id,
            },
          },
        },
      });
      return true;

    case "number":
      if (
        !numericTarget ||
        !numericTarget.startValue ||
        !numericTarget.endValue
      ) {
        return "a numeric target is required";
      }

      await db.goalTarget.create({
        data: {
          goal_target_name: targetName,
          goal_target_type: targetType,
          goal_current_value: numericTarget.startValue,
          goal_target_value: numericTarget.endValue,
          goal_target_achieved: false,
          goal_target_goal: {
            connect: {
              goal_id: goal_id,
            },
          },
        },
      });

      return true;

    case "done_not_done":
      if (!doneNotDone) {
        return "a done not done must be given";
      }

      await db.goalTarget.create({
        data: {
          goal_target_name: targetName,
          goal_target_type: targetType,
          goal_target_achieved: doneNotDone,
          goal_target_goal: {
            connect: {
              goal_id: goal_id,
            },
          },
        },
      });
      return true;

    case "milestone":
      if (!mileStones || mileStones.length <= 0) {
        return "milestones  must be provided for this type";
      }

      await db.goalTarget.create({
        data: {
          goal_target_name: targetName,
          goal_target_type: targetType,
          goal_target_tasks: {
            createMany: {
              data: mileStones.map((milestone) => {
                return {
                  target_task_done: false,
                  target_task_name: milestone.name,
                };
              }),
            },
          },
          goal_target_goal: {
            connect: {
              goal_id: goal_id,
            },
          },
        },
      });
      return true;

    default:
      return false;
  }
}

import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getIdFromParams } from "@/lib/utils";
import { Goal, Type } from "@prisma/client";

export async function DELETE(
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

    const findGoal = await db.goal.findFirst({
      where: {
        goal_id: goalId,
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

    if (findGoal.goal_user_id !== user.user_id) {
      return NextResponse.json(
        {
          error: [
            {
              message:
                "This goal does not belong to you, you cannot delete this goal",
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    await db.goal.delete({
      where: {
        goal_id: findGoal.goal_id,
      },
    });

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

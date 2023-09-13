import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { editGoalSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getIdFromParams } from "@/lib/utils";

export async function PUT(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();
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

    let { goalTitle, goalDescription, goalTimeline } = editGoalSchema.parse({
      ...body,
      goalTimeline: body.goalTimeline ? new Date(body.goalTimeline) : undefined,
    });

    await db.goal.update({
      where: {
        goal_id: goalId,
      },
      data: {
        goal_title: goalTitle,
        goal_description: goalDescription,
        goal_timeline: goalTimeline,
        goal_user: {
          connect: {
            user_id: user.user_id,
          },
        },
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

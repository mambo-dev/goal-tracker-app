import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { createGoalSchema, editGoalSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assignTimeline } from "../../validatetype";
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

    let { goalTitle, goalUserTimeline } = editGoalSchema.parse({
      ...body,
      goalUserTimeline: new Date(body.goalUserTimeline),
    });
    let goalTypeTimeline: Date = assignTimeline(findGoal.goal_type);

    if (goalUserTimeline > goalTypeTimeline) {
      return NextResponse.json(
        {
          error: [
            {
              message: `sorry cannot update that timeline under ${findGoal.goal_type} plan`,
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    await db.goal.update({
      where: {
        goal_id: goalId,
      },
      data: {
        goal_title: goalTitle,
        goal_achieved: false,
        goal_type_timeline: goalTypeTimeline,
        goal_user_timeline: goalUserTimeline,
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

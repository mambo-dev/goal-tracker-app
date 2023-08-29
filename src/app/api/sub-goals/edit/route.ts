import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { editSubGoalSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { getIdFromParams } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();
    const subGoalId = getIdFromParams("subGoalId", request.url);

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

    let { subGoalAchieved, subGoalTimeline, subGoalTitle } =
      editSubGoalSchema.parse({
        ...body,
        subGoalTimeline: new Date(body.subGoalTimeline),
      });

    await db.subGoal.update({
      where: {
        subgoal_id: subGoalId,
      },
      data: {
        subgoal_achieved: subGoalAchieved,
        subgoal_title: subGoalTitle,
        subgoal_user_timeline: subGoalTimeline,
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

import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { createGoalSchema, editGoalSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assignTimeline } from "../validatetype";
import { getIdFromParams } from "@/lib/utils";

export async function DELETE(
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

    await db.goal.delete({
      where: {
        goal_id: Number(goalId),
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

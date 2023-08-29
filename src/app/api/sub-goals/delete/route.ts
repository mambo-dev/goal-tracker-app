import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { ServerResponse } from "@/lib/types";
import { getIdFromParams } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
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

    await db.subGoal.delete({
      where: {
        subgoal_id: subGoalId,
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

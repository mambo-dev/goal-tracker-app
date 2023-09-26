import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { targetActionsSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { getIdFromParams } from "@/lib/utils";
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

    const findTarget = await db.goalTarget.findUnique({
      where: {
        goal_target_id: target_id,
      },
    });

    if (!findTarget) {
      return NextResponse.json(
        {
          error: [
            {
              message: "Oops sorry this task may have been deleted or moved",
            },
          ],
          okay: false,
        },
        {
          status: 200,
        }
      );
    }

    const { targetActionType, targetNewName } = targetActionsSchema.parse(body);

    if (targetActionType === "rename") {
      await db.goalTarget.update({
        where: {
          goal_target_id: findTarget.goal_target_id,
        },
        data: {
          goal_target_name: targetNewName,
        },
      });
    } else {
      await db.goalTarget.delete({
        where: {
          goal_target_id: findTarget.goal_target_id,
        },
      });
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

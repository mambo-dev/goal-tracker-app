import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/schemas";
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

    const task_id = getIdFromParams("task_id", request.url);

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

    const findTask = await db.targetTasks.findUnique({
      where: {
        target_tasks_id: task_id,
      },
    });

    if (!findTask) {
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

    const { taskActionType } = updateTaskSchema.parse(body);

    if (taskActionType === "check") {
      await db.targetTasks.update({
        where: {
          target_tasks_id: findTask.target_tasks_id,
        },
        data: {
          target_task_achieved: true,
        },
      });
    } else {
      await db.targetTasks.delete({
        where: {
          target_tasks_id: findTask.target_tasks_id,
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

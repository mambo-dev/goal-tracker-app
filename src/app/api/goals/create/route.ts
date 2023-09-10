import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { createGoalSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assignTimeline } from "../validatetype";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();

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

    let { goalTitle, goalType } = createGoalSchema.parse(body);

    let goalTypeTimeline: Date = assignTimeline(goalType);

    await db.goal.create({
      data: {
        goal_title: goalTitle,
        goal_achieved: false,
        goal_type: goalType,
        goal_type_timeline: goalTypeTimeline,
        goal_previous_timeline: goalTypeTimeline,
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

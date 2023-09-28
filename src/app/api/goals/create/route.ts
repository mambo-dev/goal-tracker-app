import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { createGoalSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assignTimeline } from "../validatetype";
import { AnalyticsCreationError } from "@/lib/utils";

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

    let { goalTitle, goalDescription, goalTimeline } = createGoalSchema.parse({
      ...body,
      goalTimeline: body.goalTimeline ? new Date(body.goalTimeline) : undefined,
    });

    await db.goal.create({
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

    const findUserAnalytics = await db.analyticsTracker.findUnique({
      where: {
        analytics_user_id: user.user_id,
      },
    });

    if (!findUserAnalytics) {
      throw new AnalyticsCreationError();
    }

    await db.analyticsTracker.update({
      where: {
        analytics_user_id: user.user_id,
      },
      data: {
        analytics_goals_created:
          (findUserAnalytics.analytics_goals_created += 1),
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

import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getIdFromParams } from "@/lib/utils";
import { Goal, Type } from "@prisma/client";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export async function GET(
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
      include: {
        goal_targets: true,
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

    const user_analytics = await db.analyticsTracker.findUnique({
      where: {
        analytics_user_id: user.user_id,
      },
    });

    if (!user_analytics) {
      throw new Error("failed to create analytics on sign up");
    }

    const add_achieved_goals = (user_analytics.analytics_goals_achieved += 1);
    const goal_targets = findGoal.goal_targets
      ? findGoal.goal_targets.length
      : 0;
    const add_completed_targets = (user_analytics.analytics_targets_completed +=
      goal_targets);

    await db.analyticsTracker.update({
      where: {
        analytics_id: user_analytics.analytics_id,
      },
      data: {
        analytics_goals_achieved: add_achieved_goals,
        analytics_targets_completed: add_completed_targets,
      },
    });

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

function setNewTimeline(goalType: Type, goalTimeline: Date): Date {
  switch (goalType) {
    case "daily":
      return addDays(goalTimeline, 1);

    case "weekly":
      return addWeeks(goalTimeline, 1);

    case "monthly":
      return addMonths(goalTimeline, 1);

    case "yearly":
      return addYears(goalTimeline, 1);
  }
}

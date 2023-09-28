import { userExistsAndAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { ServerResponse } from "@/lib/types";
import { AnalyticsCreationError } from "@/lib/utils";
import { AnalyticsTracker } from "@prisma/client";
import { intervalToDuration } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<
  NextResponse<
    ServerResponse<{
      analytics: AnalyticsTracker;
      totalActiveGoals: number;
      totalActiveTargets: number;
      percentageCompletedGoals: number;
      percentageCompletedTasks: number;
    }>
  >
> {
  try {
    const { user, message } = await userExistsAndAuthorized();

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
          status: 200,
        }
      );
    }

    const findUserAnalytics = await db.analyticsTracker.findUnique({
      where: {
        analytics_user_id: user.user_id,
      },
      include: {
        analytics_streaks: true,
      },
    });

    if (!findUserAnalytics) {
      throw new AnalyticsCreationError();
    }

    const longestStreaks = findUserAnalytics.analytics_streaks.map((streak) => {
      if (!streak.streak_endtime) {
        return {
          streak_duration: 0,
        };
      }

      const duration = intervalToDuration({
        start: streak.streak_starttime,
        end: streak.streak_endtime,
      });

      if (!duration.days) {
        throw new Error("invalid days");
      }

      return {
        streak_duration: duration.days,
      };
    });

    let getLongestStreak: number = 0;
    longestStreaks.forEach((streak, index) => {
      if (
        longestStreaks[index].streak_duration >
        longestStreaks[index + 1].streak_duration
      ) {
        getLongestStreak = streak.streak_duration;
      }
    });

    const updatedAnalytics = await db.analyticsTracker.update({
      where: {
        analytics_id: findUserAnalytics.analytics_id,
      },
      data: {
        analytics_longest_streak: getLongestStreak,
      },
    });

    const totalActiveGoals = await db.goal.findMany({
      where: {
        goal_achieved: false,
      },
    });

    const totalActiveTargets = await db.goalTarget.findMany({
      where: {
        goal_target_achieved: false,
      },
    });

    //graph data is all a targets vs dates achieved

    return NextResponse.json(
      {
        data: {
          analytics: updatedAnalytics,
          totalActiveGoals: totalActiveGoals.length,
          totalActiveTargets: totalActiveTargets.length,
          percentageCompletedGoals: Math.floor(
            (updatedAnalytics.analytics_goals_achieved /
              updatedAnalytics.analytics_goals_created) *
              100
          ),
          percentageCompletedTasks: Math.floor(
            (updatedAnalytics.analytics_targets_completed /
              updatedAnalytics.analytics_targets_created) *
              100
          ),
        },

        okay: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

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

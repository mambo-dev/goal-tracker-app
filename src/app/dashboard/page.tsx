import DashboardStats from "@/components/dashboard/home/dashboard-stats";
import Display from "@/components/dashboard/home/display-tag";
import { userExistsAndAuthorized } from "@/lib/auth";
import { ServerResponse } from "@/lib/types";
import { AnalyticsTracker, Goal } from "@prisma/client";
import { getHours } from "date-fns";
import React from "react";

type Props = {};

const getDashboardStats = async () => {
  try {
    const res = await fetch("/api/dasboard", {
      method: "GET",
      credentials: "include",
    });

    const data = (await res.json()) as ServerResponse<{
      analytics: AnalyticsTracker;
      totalActiveGoals: number;
      totalActiveTargets: number;
      percentageCompletedGoals: number;
      percentageCompletedTasks: number;
      recentGoals: Goal[];
    }>;

    if (!data.data || data.error) {
      throw new Error(
        "something went wrong could not fetch data kindly refresh"
      );
    }

    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error("failed to get dashboard data kindly refresh");
  }
};

export default async function Dashboard({}: Props) {
  const { user, message } = await userExistsAndAuthorized();
  const currentTime = new Date();
  const hour = getHours(currentTime);

  const dashBoardStats = await getDashboardStats();

  return (
    <div className="min-h-screen flex flex-col py-4 gap-6">
      <div className="w-full grid grid-cols-9  gap-6 md:h-[200px]">
        <Display
          className="bg-purple-100 bg-opacity-20 col-span-3 shadow rounded-md border border-gray-300 py-2 px-2  h-full flex items-start justify-start relative"
          title={
            hour < 12
              ? `Good morning ${user?.user_username}`
              : hour < 18
              ? `Good afternoon ${user?.user_username}`
              : `Good evening ${user?.user_username}`
          }
          imageLink="welcome.svg"
          link="/dashboard/goals"
          tertiaryTitle="Continue where you left off"
        />

        <DashboardStats
          totalActiveGoals={dashBoardStats.totalActiveGoals}
          totalActiveTargets={dashBoardStats.totalActiveTargets}
          percentageCompletedGoals={dashBoardStats.percentageCompletedGoals}
          percentageCompletedTasks={dashBoardStats.percentageCompletedTasks}
        />
      </div>
    </div>
  );
}

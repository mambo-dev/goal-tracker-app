import DashboardStats from "@/components/dashboard/home/dashboard-stats";
import Display from "@/components/dashboard/home/display-tag";
import { userExistsAndAuthorized } from "@/lib/auth";
import { getHours } from "date-fns";
import React from "react";

type Props = {};

export default async function Dashboard({}: Props) {
  const { user, message } = await userExistsAndAuthorized();
  const currentTime = new Date();
  const hour = getHours(currentTime);
  return (
    <div className="min-h-screen flex flex-col py-4 gap-6">
      <div className="w-full grid grid-cols-9  gap-6 md:h-[200px]">
        <Display
          className=" col-span-3 bg-white shadow rounded-md border border-gray-300 py-2 px-2  h-full flex items-start justify-start relative"
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

        <DashboardStats />
      </div>
    </div>
  );
}

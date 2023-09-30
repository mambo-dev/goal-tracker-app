import React from "react";

type Props = {};

export default function DashboardStats({}: Props) {
  return (
    <div className=" col-span-6 w-full bg-white shadow rounded-md border border-gray-300 py-2 px-2  h-full flex items-start justify-start relative">
      <div className="w-fit mr-auto flex flex-col space-y-1.5 text-center sm:text-left ">
        <h4 className="text-xl font-semibold leading-none tracking-tight">
          General Statistics
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          See your progress at a glance all active and completed goals appear
          here as well as your percentage of achievement
        </p>
      </div>
    </div>
  );
}

import React from "react";

type Props = {
  totalActiveGoals: number;
  totalActiveTargets: number;
  percentageCompletedGoals: number;
  percentageCompletedTasks: number;
};

export default function DashboardStats({
  totalActiveGoals,
  totalActiveTargets,
  percentageCompletedGoals,
  percentageCompletedTasks,
}: Props) {
  const stats = [
    {
      title: "Active goals",
      icon: "",
      value: totalActiveGoals,
      percentage: false,
      bgColor: "bg-purple-500 bg-opacity-70",
    },
    {
      title: "Active targets",
      icon: "",
      value: totalActiveTargets,
      percentage: false,
      bgColor: "bg-green-500 bg-opacity-70",
    },
    {
      title: "Goals completed",
      icon: "",
      value: percentageCompletedGoals,
      percentage: true,
      bgColor: "bg-orange-500 bg-opacity-70",
    },
    {
      title: "targets completed",
      icon: "",
      value: percentageCompletedTasks,
      percentage: true,
      bgColor: "bg-yellow-500 bg-opacity-70",
    },
  ];
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
      <div className="mb-0 grid grid-cols-4  gap-6">
        {stats.map((stats, index) => {
          return (
            <div key={index} className="w-full flex  items-center">
              <div></div>
              <div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

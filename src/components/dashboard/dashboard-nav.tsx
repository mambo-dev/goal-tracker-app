import React from "react";
import AddGoal from "./goals/add-goal";
import ProfileMenu from "./profile-menu";
import { NavList, UserAndAccount } from "@/lib/types";
import Link from "next/link";
import { getUserStreak } from "@/lib/utils";

type Props = {
  user: UserAndAccount;
};

export default async function DashboardMainNav({ user }: Props) {
  const navList: NavList[] = [
    {
      name: "Overview",
      link: "/",
    },
    {
      name: "Goals",
      link: "/goals",
      streak: await getUserStreak(user.user_id),
    },
  ];

  return (
    <nav className="border-b border-slate-200  py-5 px-2 h-16 flex items-center justify-between">
      <ProfileMenu user={user} navList={navList} />
      <div className="hidden sm:flex items-center gap-4 justify-center text-slate-800 font-medium mx-auto ">
        {navList.map((list, index) => (
          <div className="flex items-center gap-1 justify-center" key={index}>
            <Link
              href={`/dashboard${list.link}`}
              key={index}
              className="hover:underline transition-all delay-75 flex items-center gap-2"
            >
              {list.name}
            </Link>
            {list.streak
              ? list.streak > 0 && (
                  <span className="rounded-3xl p-1 px-2 bg-gray-100 border border-gray-300 text-xs">
                    {`${list.streak} 🔥`}
                  </span>
                )
              : null}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 w-fit py-3 px-2 ml-auto">
        <AddGoal />
      </div>
    </nav>
  );
}

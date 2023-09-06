"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NavList, UserAndAccount } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useSignOut } from "../hooks/signout";
import Link from "next/link";

type Props = {
  user: UserAndAccount;
  navList: NavList[];
};

export default function ProfileMenu({ user, navList }: Props) {
  const { isLoading, signOut } = useSignOut();
  return (
    <div className="w-fit ">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex rounded-md outline-none items-center gap-3 justify-between px-2 w-48 bg-white hover:bg-gray-100 border border-slate-200 shadow-sm focus:shadow-md py-1">
          <OpenProfile username={user.user_username} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_username}
              </p>
              <p className="text-xs leading-none text-slate-600">
                {user.user_email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="flex flex-col items-start justify-center gap-2 sm:hidden">
            {navList.map((list, index) => (
              <DropdownMenuItem
                className="flex items-center  justify-between w-full"
                key={index}
              >
                <Link
                  href={`/dashboard/${list.link}`}
                  key={index}
                  className="hover:underline transition-all delay-75 flex items-center gap-2"
                >
                  <DropdownMenuItem>{list.name}</DropdownMenuItem>
                </Link>
                {list.streak
                  ? list.streak > 0 && (
                      <span className="rounded-3xl p-1 px-2 bg-gray-100 border border-gray-300 text-xs">
                        {`${list.streak} 🔥`}
                      </span>
                    )
                  : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            {isLoading ? (
              <div className="flex items-center gap-3">
                logging out... <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Log out"
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function OpenProfile({
  username,
  userImage,
}: {
  username: string;
  userImage?: string;
}) {
  return (
    <>
      <div className="flex items-center justify-start gap-3  font-semibold text-slate-700">
        <Avatar className="h-7 w-7">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="p-2">
            {username.charAt(0) + username.charAt(username.length - 1)}
          </AvatarFallback>
        </Avatar>
        {username}
      </div>
      <ChevronsUpDown className="h-4 w-4 text-slate-600" />
    </>
  );
}

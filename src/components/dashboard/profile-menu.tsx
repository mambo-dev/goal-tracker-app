"use client";
import React, { useState } from "react";
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
import { BadgeCheck, ChevronsUpDown, Loader2, ShieldCheck } from "lucide-react";
import { useSignOut } from "../hooks/signout";
import Link from "next/link";

import Modal from "../ui/modals";
import VerifyUserEmail from "./verify-account";
import EnableTwoFactor from "./two-factor";
import { ToolTipCustom } from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  user: UserAndAccount;
  navList: NavList[];
};

export default function ProfileMenu({ user, navList }: Props) {
  const { isLoading, signOut } = useSignOut();
  const [accountAction, setAccountAction] = useState<"verify" | "two-factor">(
    "verify"
  );
  return (
    <div className="w-fit ">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex rounded-md outline-none items-center gap-3 justify-between px-2 w-48 bg-white hover:bg-gray-100 border border-slate-200 shadow-sm focus:shadow-md py-1">
            <OpenProfile username={user.user_username} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="w-full flex item-start justify-between">
                  <p className="text-sm font-medium leading-none">
                    {user.user_username}
                  </p>
                  <div className="flex items-center gap-2 text-green-700 font-bold">
                    {user.account_verified && (
                      <ToolTipCustom
                        trigger={<BadgeCheck className="h-4 w-4" />}
                        content="account is verified"
                      />
                    )}
                    {user.account_two_factor && (
                      <ToolTipCustom
                        trigger={<ShieldCheck className="h-4 w-4" />}
                        content="two factor is enabled"
                      />
                    )}
                  </div>
                </div>
                <p className="text-xs leading-none text-slate-600">
                  {user.user_email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>Profile</DropdownMenuItem>

            {!user.account_verified && (
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => setAccountAction("verify")}>
                  Verify account
                </DropdownMenuItem>
              </DialogTrigger>
            )}
            {!user.account_two_factor && (
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => setAccountAction("two-factor")}
                >
                  Enable two factor
                </DropdownMenuItem>
              </DialogTrigger>
            )}

            <DropdownMenuSeparator className="flex sm:hidden" />
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
                  logging out...{" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Log out"
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <AccountActionsHeader accountAction={accountAction} />
          <AccountActionsTab accountAction={accountAction} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AccountActionsHeader({
  accountAction,
}: {
  accountAction: "verify" | "two-factor";
}) {
  if (accountAction === "verify") {
    return (
      <DialogHeader>
        <DialogTitle>Verify you account.</DialogTitle>
        <DialogDescription>
          The code was sent to your email. Glad to see you are using a valid
          email. Thank you for your trust in us.
        </DialogDescription>
      </DialogHeader>
    );
  } else {
    return (
      <DialogHeader>
        <DialogTitle>Enable Two Factor Auth.</DialogTitle>
        <DialogDescription>
          A great step towards securing your account, you will be prompted to
          enter a code next time you log in.
        </DialogDescription>
      </DialogHeader>
    );
  }
}

function AccountActionsTab({
  accountAction,
}: {
  accountAction: "verify" | "two-factor";
}) {
  return accountAction === "verify" ? <VerifyUserEmail /> : <EnableTwoFactor />;
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

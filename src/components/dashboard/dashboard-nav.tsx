import React from "react";
import Button from "../ui/button";
import TwoFactor from "./two-factor";
import VerifyAccount from "./verify-account";
import AddGoal from "./goals/add-goal";

type Props = {
  verifiedAccount: boolean;
  enabledTwoFactor: boolean;
};

export default function DashboardMainNav({
  enabledTwoFactor,
  verifiedAccount,
}: Props) {
  return (
    <nav className="shadow-md h-14 flex items-center justify-end">
      <div className="flex items-center gap-3 w-fit py-3 px-2 ml-auto">
        <TwoFactor enabledTwoFactor={enabledTwoFactor} />
        <VerifyAccount verifiedAccount={verifiedAccount} />
        <AddGoal />
      </div>
    </nav>
  );
}

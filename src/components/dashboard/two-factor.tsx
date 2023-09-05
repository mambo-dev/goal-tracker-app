"use client";
import { ShieldCheck, ShieldX } from "lucide-react";
import React, { useState } from "react";
import { ToolTipCustom } from "../ui/tooltip";
import Modal from "../ui/modals";
import Button from "../ui/button";
import useError from "../hooks/error";
import { enableTwofactorAuth } from "@/lib/api-calls/account/two-factor";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";

type Props = {
  enabledTwoFactor: boolean;
};

export default function TwoFactor({ enabledTwoFactor }: Props) {
  return (
    <div>
      {enabledTwoFactor ? (
        <ToolTipCustom
          content="Great, you have enabled two factor"
          trigger={
            <button className="w-fit h-fit outline-none rounded-full p-2 bg-slate-50">
              <ShieldCheck className="h-6 w-6 text-green-500 " />
            </button>
          }
        />
      ) : (
        <Modal
          button={
            <button className="w-fit h-fit outline-none rounded-full p-2 bg-slate-50">
              <ShieldX className="h-6 w-6 text-red-500 " />
            </button>
          }
          contentClassName="max-w-md"
          title="Enable Two Factor Auth"
          description="A great step towards securing your account, you will be prompted to enter a code next time you log in."
        >
          <EnableTwoFactor />
        </Modal>
      )}
    </div>
  );
}

function EnableTwoFactor() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useError();
  const router = useRouter();

  async function HandleTwoFactor() {
    setIsLoading(true);
    try {
      await enableTwofactorAuth();
      toast({
        type: "success",
        message: "Thank you for enabling two factor authentication",
        title: "Two factor enabled",
      });
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="default"
      size="default"
      isLoading={isLoading}
      onClick={HandleTwoFactor}
    >
      enable two factor
    </Button>
  );
}

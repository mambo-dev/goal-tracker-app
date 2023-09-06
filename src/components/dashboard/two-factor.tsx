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

export default function EnableTwoFactor() {
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

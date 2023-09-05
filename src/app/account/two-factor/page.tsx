import TwoFactorForm from "@/components/accounts/two-factor/two-factor";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Goalee | Two factor",
  description: "Track your goals and progress",
};

type Props = {};

export default function TwoFactorPage({}: Props) {
  return <TwoFactorForm />;
}

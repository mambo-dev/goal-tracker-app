"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";
import React from "react";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";

export const metadata: Metadata = {
  title: "Goalee | Two factor",
  description: "Track your goals and progress",
};

type Props = {};

export default function TwoFactorPage({}: Props) {
  return (
    <form className="max-w-md rounded-md mx-auto mt-20 bg-white shadow-md py-2 px-3 flex items-center justify-center gap-3 flex-col">
      <div className="w-full flex text-left items-start justify-center flex-col ">
        <h1 className="text-xl text-left font-bold ">
          Two Factor Authentication
        </h1>
        <Paragraph size="sm">
          Kindly enter the code sent to your email address
        </Paragraph>
      </div>
      <Input />
      <Button size="default" variant="default">
        verify code
      </Button>
    </form>
  );
}

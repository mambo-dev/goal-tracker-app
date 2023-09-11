"use client";
import React from "react";
import Heading from "./heading";
import Paragraph from "./paragraph";

type Props = {
  icon: any;
  title: string;
  subTitle: string;
  action?: any;
};

export default function EmptyState({ icon, title, subTitle, action }: Props) {
  return (
    <div className="max-w-full w-full md:w-[700px] mt-20 px-2 flex flex-col  gap-4 items-center py-4 border-2 border-dashed border-slate-400 rounded-md mx-auto   ">
      <div className="text-6xl w-fit text-slate-700"> {icon}</div>
      <Heading size="xs">{title}</Heading>
      <Paragraph size="sm">{subTitle}</Paragraph>
      <div className="w-32">{action}</div>
    </div>
  );
}

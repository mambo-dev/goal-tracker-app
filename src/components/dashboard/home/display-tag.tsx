import { ArrowRightFromLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  number?: boolean;
  link?: string;
  secondaryTitle?: string | number;
  tertiaryTitle?: string;
  imageLink: string;
  className: string;
};

export default function Display({
  title,
  number,
  secondaryTitle,
  tertiaryTitle,
  imageLink,
  link,
  className,
}: Props) {
  if (number) {
    return (
      <div className={className}>
        <div className="w-full z-10 sm:w-3/4 text-left flex items-start justify-start flex-col gap-y-2 ">
          <h1 className="text-xl font-semibold leading-none tracking-tight">
            {title}
          </h1>
          <span className="w-14 h-14 rounded-full  border border-gray-300 flex items-center justify-center text-lg font-bold bg-slate-50 text-slate-700 ">
            {secondaryTitle}
          </span>
        </div>
        <div className="flex  absolute top-0 bottom-0 right-0  h-full w-1/2 z-0  ">
          <Image
            alt="welcome"
            src={`/${imageLink}`}
            width={100}
            height={100}
            className="w-full h-full z-0 "
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="w-fit  z-20 mr-auto flex flex-col space-y-1.5 text-center sm:text-left ">
        <h4 className="text-xl font-semibold leading-none tracking-tight">
          {title}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Glad to see you&apos;re back
        </p>
        <Link
          href={!link ? "/" : link}
          className="text-blue-500 hover:underline group flex items-center justify-center gap-x-1"
        >
          {tertiaryTitle}
          <ArrowRightFromLine className="w-4 h-4 group-hover:animate-bounce " />
        </Link>
      </div>
      <div className="flex  absolute top-0 bottom-0 right-0 left-16 h-full w-full z-0  ">
        <Image
          alt="welcome"
          src="/welcome.svg"
          width={200}
          height={100}
          className="w-full h-full z-0 "
        />
      </div>
    </div>
  );
}

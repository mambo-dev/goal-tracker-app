"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import Heading from "../ui/heading";

type Props = {};

export default function AccountNavBar({}: Props) {
  const router = useRouter();

  return (
    <nav className="w-full px-6 py-2 flex items-center text-slate-700 justify-between  bg-white bg-opacity-80 shadow-md h-16 ">
      <div className="w-fit">
        <Link href="/">
          <Heading
            size="xs"
            className="text-slate-700 font-semibold hover:text-purple-600"
          >
            Goalee
          </Heading>
        </Link>
      </div>
      <div className="w-fit">
        <button
          onClick={() => router.back()}
          className=" rounded-md shadow border border-slate-300 ring-offset-1 h-10 w-full py-4 px-3 inline-flex items-center justify-center  bg-neutral-200 hover:bg-neutral-100 text-slate-600 font-semibold  focus:ring-2 ring-slate-600 "
        >
          <ChevronLeft className="h-5 w-5 text-slate-900" />
          back
        </button>
      </div>
    </nav>
  );
}

"use client";

import { AlertOctagon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function HandleError({
  error,
  type,
}: {
  error: Error;
  type?: "goalNotFound" | "noAccess";
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg gap-3 mx-auto mt-20 border border-gray-300 shadow rounded-md flex flex-col py-2 px-2  items-center justify-center">
      <AlertOctagon
        className="text-red-500 h-20 w-20 "
        strokeWidth={"0.75px"}
      />
      <h2 className="text-4xl font-semibold text-slate-800 ">
        Oops Something went wrong!
      </h2>
      <p className="font-medium text-slate-700">
        {error.message ||
          "We are stumped we failed to find the cause! A thousand apologies"}
      </p>
      <Link href="/dashboard">
        <button className=" rounded-md hover:bg-red-300 font-semibold h-10 py-2 px-2 inline-flex items-center justify-center border outline-none border-red-500 bg-red-200 text-red-900">
          Dashboard
        </button>
      </Link>
    </div>
  );
}

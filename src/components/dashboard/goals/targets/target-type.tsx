"use client";
import { Input } from "@/components/ui/input";
import { Target } from "@prisma/client";
import { ArrowRight, Plus, PlusCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  target: Target;
};

export default function TargetType({ target }: Props) {
  const [numericTarget, setNumericTarget] = useState({
    startValue: 0,
    endValue: 1,
  });
  const [currencyTarget, setCurrencyTarget] = useState({
    startValue: 0,
    endValue: 1,
  });
  const [mileStones, setMileStones] = useState([{ name: "" }]);

  switch (target) {
    case "curency":
      return (
        <CurrencyTarget
          currencyTarget={currencyTarget}
          setCurrencyTarget={setCurrencyTarget}
        />
      );
    case "done_not_done":
      return <DoneNotDoneTarget />;
    case "milestone":
      return (
        <MileStone mileStones={mileStones} setMileStones={setMileStones} />
      );
    case "number":
      return (
        <NumericTarget
          numericTarget={numericTarget}
          setNumericTarget={setNumericTarget}
        />
      );

    default:
      return null;
  }
}

function NumericTarget({
  numericTarget,
  setNumericTarget,
}: {
  numericTarget: {
    startValue: number;
    endValue: number;
  };
  setNumericTarget: React.Dispatch<
    React.SetStateAction<{
      startValue: number;
      endValue: number;
    }>
  >;
}) {
  return (
    <div className="grid grid-cols-9 w-full  gap-1">
      <div className="flex flex-col items-start w-full col-span-4 ">
        <label className="text-sm text-slate-700 font-medium">Start</label>
        <input
          type="number"
          value={numericTarget.startValue}
          onChange={(e) =>
            setNumericTarget({
              ...numericTarget,
              startValue: Number(e.target.value),
            })
          }
          className="py-1 w-full px-2 rounded-md border border-gray-300  bg-gray-50  text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-400 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900"
        />
      </div>
      <div className="flex  items-end justify-center w-full col-span-1">
        <ArrowRight className="w-5 h-5 text-slate-700" />
      </div>
      <div className="flex flex-col items-start w-full col-span-4 ">
        <label className="text-sm text-slate-700 font-medium">End</label>
        <input
          type="number"
          value={numericTarget.endValue}
          onChange={(e) =>
            setNumericTarget({
              ...numericTarget,
              endValue: Number(e.target.value),
            })
          }
          className="py-1 w-full px-2 rounded-md border border-gray-300  bg-gray-50  text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-400 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900"
        />
      </div>
    </div>
  );
}

function CurrencyTarget({
  currencyTarget,
  setCurrencyTarget,
}: {
  currencyTarget: {
    startValue: number;
    endValue: number;
  };
  setCurrencyTarget: React.Dispatch<
    React.SetStateAction<{
      startValue: number;
      endValue: number;
    }>
  >;
}) {
  return (
    <div className="grid grid-cols-9 w-full  gap-1">
      <div className="flex flex-col items-start w-full col-span-4 ">
        <label className="text-sm text-slate-700 font-medium">Start</label>
        <div className="w-full relative">
          <span className="absolute top-1 bottom-1 mr-auto left-1 text-sm">
            $
          </span>
          <input
            type="number"
            value={currencyTarget.startValue}
            onChange={(e) =>
              setCurrencyTarget({
                ...currencyTarget,
                startValue: Number(e.target.value),
              })
            }
            className="py-1 w-full px-4 rounded-md border border-gray-300  bg-gray-50  text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-400 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900"
          />
        </div>
      </div>
      <div className="flex  items-end justify-center w-full col-span-1">
        <ArrowRight className="w-5 h-5 text-slate-700" />
      </div>
      <div className="flex flex-col items-start w-full col-span-4 ">
        <label className="text-sm text-slate-700 font-medium">End</label>
        <div className="w-full relative">
          <span className="absolute top-1 bottom-1 mr-auto left-1 text-sm">
            $
          </span>
          <input
            type="number"
            value={currencyTarget.endValue}
            onChange={(e) =>
              setCurrencyTarget({
                ...currencyTarget,
                endValue: Number(e.target.value),
              })
            }
            className="py-1 w-full px-4 rounded-md border border-gray-300  bg-gray-50  text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-400 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900"
          />
        </div>
      </div>
    </div>
  );
}

function DoneNotDoneTarget() {
  return (
    <div className="w-full text-sm text-purple-700">
      <p>Great!! target set finalize by sending the form</p>
    </div>
  );
}

function MileStone({
  mileStones,
  setMileStones,
}: {
  mileStones: { name: string }[];
  setMileStones: React.Dispatch<React.SetStateAction<{ name: string }[]>>;
}) {
  const [mileStoneName, setMileStoneName] = useState({ name: "" });
  return (
    <div className="w-full flex items-center flex-col justify-center">
      <div className="flex items-center w-full gap-3">
        <Input
          value={mileStoneName.name}
          onChange={(e) => setMileStoneName({ name: e.target.value })}
        />
        <button
          className="w-fit h-fit py-2"
          onClick={() => {
            setMileStones([...mileStones, mileStoneName]);
          }}
        >
          <PlusCircle className="h-5 w-5 text-slate-400" />
        </button>
      </div>
      <div className="grid grid-cols-1 w-full gap-4">
        {mileStones.map((mileStone, index) => (
          <div
            className="w-full border rounded-md border-gray-300 shadow-sm py-2 px-2 flex items-center justify-between"
            key={index}
          >
            <span className="text-sm text-slate-700 font-medium">
              {mileStone.name}
            </span>
            <button
              onClick={() => {
                setMileStones(
                  mileStones.filter((mileStone) => !mileStone.name)
                );
              }}
              className="outline-none w-fit h-fit "
            >
              <X className="h-4 w-4 text-red-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { format, getTime } from "date-fns";
import React, { forwardRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

type Props = {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  label?: string;
};

export default function DatePickerComponent({
  date,
  setDate,
  fromDate,
  toDate,
  label,
}: Props) {
  if (label) {
    return (
      <div className="flex flex-col gap-2 w-full ">
        <label className="font-medium text-sm text-slate-800">{label}</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex  h-10 w-full rounded-md border border-gray-300  bg-gray-50 py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-400 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "eeee") : <span>Pick a date</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              fromDate={new Date(`${fromDate}`)}
              toDate={new Date(`${toDate}`)}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex  h-10 w-full rounded-md border border-gray-300  bg-gray-50 py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-400 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "eeee") : <span>Pick a date</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          fromDate={new Date(`${fromDate}`)}
          toDate={new Date(`${toDate}`)}
        />
      </PopoverContent>
    </Popover>
  );
}

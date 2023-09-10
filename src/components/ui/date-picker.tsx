import { getTime } from "date-fns";
import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  date: Date | null;
  label: string;
  startDate?: Date;
  endDate?: Date;
};

export default function DatePickerComponent({
  date,
  setDate,
  label,
  startDate,
  endDate,
}: Props) {
  return (
    <div className={`flex flex-col gap-y-2  w-full text-slate-800 font-medium`}>
      <label className="font-semibold"> {label} </label>
      <DatePicker
        selected={date}
        showMonthDropdown
        showPopperArrow
        todayButton
        showTimeInput
        showTimeSelect
        onChange={(date: Date) => setDate(date)}
        placeholderText="select date"
        minDate={startDate}
        maxDate={endDate}
        minTime={startDate}
        maxTime={endDate}
        className="w-full  text-sm gap-2  group inline-flex items-center bg-white justify-start outline-none  h-fit   rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3"
      />
    </div>
  );
}

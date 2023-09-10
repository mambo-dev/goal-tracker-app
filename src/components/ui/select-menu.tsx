import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OptionData = {
  value: string;
  display: string;
};

type SelectProps<T> = {
  options: OptionData[];
  placeholder: string;
  label?: string;
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
};

export function SelectMenu<T>({
  options,
  placeholder,
  label,
  value,
  setValue,
}: SelectProps<T>) {
  return (
    //@ts-expect-error
    <Select value={value} onValueChange={(value) => setValue(value)}>
      {label ? (
        <div className="flex flex-col gap-2 w-full ">
          <label className="font-medium text-sm text-slate-800">{label}</label>
          <SelectTrigger className="w-full text-sm gap-2  group inline-flex items-center bg-white justify-between outline-none  h-fit   rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </div>
      ) : (
        <SelectTrigger className="w-full  text-sm gap-2  group inline-flex items-center bg-white justify-between outline-none  h-fit   rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      )}

      <SelectContent>
        <SelectGroup>
          {options.map((option, index) => {
            return (
              <SelectItem key={index} value={option.value}>
                {option.display}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

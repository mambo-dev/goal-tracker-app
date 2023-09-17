"use client";
import { $Enums, Target } from "@prisma/client";
import React, { useState } from "react";

export interface RadioProps {
  id: string;
  name: string;
  label: string;
  setTargetType: React.Dispatch<React.SetStateAction<$Enums.Target>>;
  option: {
    id: Target;
    label: string;
    name: string;
    selected: boolean;
  };
  options: { id: Target; label: string; name: string; selected: boolean }[];
  setOptions: React.Dispatch<
    React.SetStateAction<
      {
        id: Target;
        label: string;
        name: string;
        selected: boolean;
      }[]
    >
  >;
}

const RadioButton = ({
  id,
  label,
  name,
  option,
  options,
  setOptions,
  setTargetType,
}: RadioProps) => {
  const handleSelected = (option: {
    id: Target;
    label: string;
    name: string;
    selected: boolean;
  }) => {
    //set current selected
    //nullify previous selected one

    const findSelectedOption = options.find(
      (selectedOption) => selectedOption.id === option.id
    );

    if (findSelectedOption) {
      const updatedOption = { ...findSelectedOption, selected: true };
      setTargetType(updatedOption.id);

      const nullifyAnyOtherSelected = options.map((option) => {
        return {
          ...option,
          selected: option.id === updatedOption.id,
        };
      });

      setOptions(nullifyAnyOtherSelected);

      return;
    }
  };
  return (
    <button
      type="button"
      id={id}
      onClick={() => handleSelected(option)}
      className={`outline-none hover:bg-neutral-100 transition-all focus:shadow-sm flex items-center gap-y-3 flex-col py-2 px-2 border border-gray-300 rounded-md ${
        option.selected ? "bg-neutral-50" : ""
      }`}
    >
      <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
        {option.selected && (
          <div className="w-2 h-2 rounded-full bg-purple-500" />
        )}
      </div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
    </button>
  );
};

export default RadioButton;

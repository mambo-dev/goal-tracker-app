"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modals";
import RadioButton from "@/components/ui/radio-button";
import { Target } from "@prisma/client";
import React, { useState } from "react";
import TargetType from "./target-type";
import FormHeader from "@/components/ui/form-header";
import { toast } from "@/components/ui/toast";

type Props = {};

export default function NewTarget({}: Props) {
  return (
    <Modal
      contentClassName="max-w-xl"
      button={
        <Button variant="default" size="default">
          Add Target
        </Button>
      }
      title="Set your new targets"
    >
      <NewTargetForm />
    </Modal>
  );
}

function NewTargetForm() {
  const [targetType, setTargetType] = useState<Target>("curency");

  const [options, setOptions] = useState<
    {
      id: Target;
      label: string;
      name: string;
      selected: boolean;
    }[]
  >([
    {
      id: "curency",
      label: "Currency",
      name: "currency",
      selected: false,
    },
    {
      id: "milestone",
      label: "Milestone",
      name: "milestone",
      selected: false,
    },
    {
      id: "done_not_done",
      label: "done/not done",
      name: "done_not_done",
      selected: false,
    },
    {
      id: "number",
      label: "Number",
      name: "number",
      selected: false,
    },
  ]);
  const findDoneNotDone = options.find(
    (option) => option.id === "done_not_done"
  );

  if (!findDoneNotDone) {
    throw new Error("contact server admin to fix this error");
  }

  const [doneNotDone, setDoneNotDone] = useState<boolean>(
    findDoneNotDone.selected
  );

  console.log(doneNotDone, findDoneNotDone.selected);

  return (
    <form className="flex flex-col items-center gap-2">
      <Input label="Target" placeholder="name your target" />
      <div className="flex flex-col gap-2 w-full ">
        <div className="w-fit mr-auto flex flex-col space-y-1.5 text-center sm:text-left ">
          <h4 className="text-sm font-medium text-slate-800 leading-none tracking-tight">
            Type of Target
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            How do you want to measure this result?
          </p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-3  "
          radioGroup=""
        >
          {options.map((option) => (
            <RadioButton
              key={option.id}
              label={option.label}
              name={option.name}
              id={option.id}
              options={options}
              option={option}
              setOptions={setOptions}
              setTargetType={setTargetType}
            />
          ))}
        </div>
      </div>

      <TargetType target={targetType} />
    </form>
  );
}

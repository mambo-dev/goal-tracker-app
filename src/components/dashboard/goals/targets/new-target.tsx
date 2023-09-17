"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modals";
import RadioButton from "@/components/ui/radio-button";
import { Target } from "@prisma/client";
import React, { useState } from "react";
import TargetType from "./target-type";

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
  return (
    <form className="flex flex-col items-center gap-2">
      <Input />

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

      <TargetType target={targetType} />
    </form>
  );
}

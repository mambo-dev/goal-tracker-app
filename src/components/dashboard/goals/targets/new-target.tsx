"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modals";
import RadioButton from "@/components/ui/radio-button";
import { Target } from "@prisma/client";
import React, { useEffect, useState } from "react";
import TargetType from "./target-type";
import FormHeader from "@/components/ui/form-header";
import { toast } from "@/components/ui/toast";
import useError from "@/components/hooks/error";
import { createTargetSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import fetchDataFromApi from "@/lib/api-calls/fetchData";
import { useRouter } from "next/navigation";

type Props = {
  goalId: number;
};

export default function NewTarget({ goalId }: Props) {
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
      <NewTargetForm goalId={goalId} />
    </Modal>
  );
}

function NewTargetForm({ goalId }: { goalId: number }) {
  const [targetType, setTargetType] = useState<Target>("number");
  const [targetName, setTargetName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [numericTarget, setNumericTarget] = useState({
    startValue: 0,
    endValue: 1,
  });
  const [currencyTarget, setCurrencyTarget] = useState({
    startValue: 0,
    endValue: 1,
  });
  const [mileStones, setMileStones] = useState<{ name: string }[]>([]);
  const router = useRouter();
  const [options, setOptions] = useState<
    {
      id: Target;
      label: string;
      name: string;
      selected: boolean;
    }[]
  >([
    {
      id: "number",
      label: "Number",
      name: "number",
      selected: true,
    },
    {
      id: "curency",
      label: "Currency",
      name: "currency",
      selected: false,
    },

    {
      id: "done_not_done",
      label: "done/not done",
      name: "done_not_done",
      selected: false,
    },
    {
      id: "milestone",
      label: "Milestone",
      name: "milestone",
      selected: false,
    },
  ]);
  const findDoneNotDone = options.find(
    (option) => option.id === "done_not_done"
  );

  if (!findDoneNotDone) {
    throw new Error("contact server admin to fix this error");
  }
  const { handleError } = useError();
  const [doneNotDone, setDoneNotDone] = useState<boolean>(false);

  useEffect(() => {
    setDoneNotDone(findDoneNotDone.selected);
  }, [findDoneNotDone.selected]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const targetDetails = createTargetSchema.parse({
        currencyTarget,
        numericTarget,
        targetType,
        mileStones,
        doneNotDone,
        targetName,
      });
      await fetchDataFromApi({
        method: "POST",
        url: `/api/goals/targets/?goal_id=${goalId}`,
        body: JSON.stringify(targetDetails),
      });

      toast({
        title: "Success setting your target",
        message: "You have succesfully set your target",
      });

      router.refresh()
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <Input
        label="Target"
        placeholder="name your target"
        value={targetName}
        onChange={(e) => setTargetName(e.target.value)}
      />
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

      <TargetType
        numericTarget={numericTarget}
        setNumericTarget={setNumericTarget}
        currencyTarget={currencyTarget}
        setCurrencyTarget={setCurrencyTarget}
        mileStones={mileStones}
        setMileStones={setMileStones}
        target={targetType}
      />

      <div className="w-24 ml-auto">
        <button className="h-10  rounded-md shadow-sm text-white text-sm    outline-none py-2 px-3 w-full inline-flex items-center justify-center bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 disabled:bg-opacity-80 focus:shadow-purple-300 ">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          submit
        </button>
      </div>
    </form>
  );
}

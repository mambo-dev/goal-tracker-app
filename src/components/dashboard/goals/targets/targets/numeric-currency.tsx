import React, { useState } from "react";
import ToggleButtons from "./toggle-buttons";
import { Loader2 } from "lucide-react";
import useError from "@/components/hooks/error";
import { useRouter } from "next/navigation";
import { Target } from "@prisma/client";
import { editTargetSchema } from "@/lib/schemas";
import { TargetWithTasks } from "@/lib/types";
import fetchDataFromApi from "@/lib/api-calls/fetchData";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";

type Props = {
  target: TargetWithTasks;
};

export default function NumericOrCurrencyTarget({ target }: Props) {
  const [status, setStatus] = useState<"increase" | "decrease">("increase");
  const [isLoading, setIsLoading] = useState(false);
  const [newTarget, setNewTarget] = useState("");
  const { handleError } = useError();
  const router = useRouter();
  const targetType: Target = target.goal_target_type;
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (targetType === "done_not_done" || targetType === "milestone") {
        return toast({
          message: "currency or numeric target only required",
        });
      }

      const targetDetails = editTargetSchema.parse({
        status,
        targetType,
        newTarget: Number(newTarget),
      });

      await fetchDataFromApi({
        method: "PUT",
        url: `/api/goals/targets/update/?target_id=${target.goal_target_id}`,
        body: JSON.stringify(targetDetails),
      });

      toast({
        message: "succesfully updated your target",
        title: "Congrats",
      });

      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mx-auto w-full gap-4"
    >
      <ToggleButtons
        action={() =>
          setStatus((prevState) => {
            if (prevState === "increase") {
              return "decrease";
            } else {
              return "increase";
            }
          })
        }
        options={{
          a: {
            value: "decrease",
            active: status === "decrease",
          },
          b: {
            value: "increase",
            active: status === "increase",
          },
        }}
      />

      <Input
        value={newTarget}
        className="h-10 mx-auto w-3/4 border-b border-gray-300 focus:border-purple-300"
        onChange={(e) => setNewTarget(e.target.value)}
        type="number"
      />

      <button
        type="submit"
        disabled={isLoading}
        className=" disabled:cursor-not-allowed focus:outline-none disabled:bg-opacity-50 text-white mx-auto bg-purple-500 text-sm font-medium rounded-md py-3 px-2 inline-flex items-center justify-center w-36 "
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "loading..." : "save update"}
      </button>
    </form>
  );
}

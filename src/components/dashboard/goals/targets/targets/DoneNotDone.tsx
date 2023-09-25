import Button from "@/components/ui/button";
import React, { useState } from "react";
import ToggleButtons from "./toggle-buttons";
import useError from "@/components/hooks/error";
import fetchDataFromApi from "@/lib/api-calls/fetchData";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  targetId: number;
};

export default function DoneNotDone({ targetId }: Props) {
  const [status, setStatus] = useState<"finished" | "inProgress">("inProgress");
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useError();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchDataFromApi({
        method: "PUT",
        url: `/api/goals/targets/update/target_id=${targetId}`,
        body: JSON.stringify({ status }),
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
            if (prevState === "inProgress") {
              return "finished";
            } else {
              return "inProgress";
            }
          })
        }
        options={{
          a: {
            value: "in progress",
            active: status === "inProgress",
          },
          b: {
            value: "finished",
            active: status === "finished",
          },
        }}
      />

      <button
        type="submit"
        disabled={status === "inProgress" || isLoading}
        className=" disabled:cursor-not-allowed focus:outline-none disabled:bg-opacity-50 text-white mx-auto bg-purple-500 text-sm font-medium rounded-md py-3 px-2 inline-flex items-center justify-center w-36 "
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "loading..." : "save update"}
      </button>
    </form>
  );
}

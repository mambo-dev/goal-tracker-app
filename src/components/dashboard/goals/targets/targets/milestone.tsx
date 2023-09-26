import useError from "@/components/hooks/error";
import { toast } from "@/components/ui/toast";
import fetchDataFromApi from "@/lib/api-calls/fetchData";
import { updateTaskSchema } from "@/lib/schemas";
import { TargetTasks } from "@prisma/client";
import { Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  mileStones: TargetTasks[];
};

export default function MileStone({ mileStones }: Props) {
  const [taskUpdate, setTaskUpdate] = useState<{
    id: number;
    loading: boolean;
    action: "check" | "delete";
  }>({ id: mileStones[0].target_tasks_id, loading: false, action: "check" });
  const router = useRouter();
  const { handleError } = useError();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const taskDetails = updateTaskSchema.parse({
        taskActionType: taskUpdate.action,
      });

      await fetchDataFromApi({
        method: "PUT",
        url: `/api/goals/targets/milestones/?task_id=${taskUpdate.id}`,
        body: JSON.stringify(taskDetails),
      });

      toast({
        message:
          taskUpdate.action === "check"
            ? "succesfully updated your task"
            : "deleted your milestone",
        title: taskUpdate.action === "check" ? "Congrats" : "Deleted!",
        type: "success",
      });

      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setTaskUpdate({ id: 0, loading: false, action: "check" });
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      <p className="text-sm text-slate-700 font-medium">
        completing your tasks updates this target
      </p>
      <div className="w-full grid grid-cols-1 gap-2 ">
        {mileStones.map((mileStone, index) => (
          <form
            onSubmit={handleSubmit}
            className="w-full border rounded-md border-purple-500 shadow-sm py-2 px-2 flex items-center justify-between"
            key={index}
          >
            <div className="relative text-sm text-slate-700 font-medium">
              <span
                className={`w-full h-full ${
                  mileStone.target_task_done && "text-slate-600 text-opacity-50"
                }`}
              >
                {mileStone.target_task_name}
              </span>
              {mileStone.target_task_done && (
                <div className=" border-b w-full border-gray-500 absolute bottom-2 right-0 left-0" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                onClick={() =>
                  setTaskUpdate({
                    action: "check",
                    id: mileStone.target_tasks_id,
                    loading: true,
                  })
                }
                className="inline-flex items-center justify-cente r outline-none"
              >
                {taskUpdate.id === mileStone.target_tasks_id &&
                taskUpdate.loading &&
                taskUpdate.action === "check" ? (
                  <Loader2 className="h-5 w-5 text-green-500 animate-spin" />
                ) : (
                  <Check className="h-5 w-5 text-green-300 hover:text-green-500" />
                )}
              </button>
              <button
                type="submit"
                onClick={() =>
                  setTaskUpdate({
                    action: "delete",
                    id: mileStone.target_tasks_id,
                    loading: true,
                  })
                }
                className="outline-none w-fit h-fit "
              >
                {taskUpdate.id === mileStone.target_tasks_id &&
                taskUpdate.loading &&
                taskUpdate.action === "delete" ? (
                  <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                ) : (
                  <X className="h-4 w-4 text-red-400 hover:text-red-500" />
                )}
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

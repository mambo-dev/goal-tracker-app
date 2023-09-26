import useError from "@/components/hooks/error";
import Button from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FormHeader from "@/components/ui/form-header";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import fetchDataFromApi from "@/lib/api-calls/fetchData";
import { targetActionsSchema } from "@/lib/schemas";
import { TargetWithTasks } from "@/lib/types";
import { DialogTrigger } from "@radix-ui/react-dialog";

import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  target: TargetWithTasks;
};

export default function TargetActions({ target }: Props) {
  const [actionType, setActionType] = useState<"rename" | "delete">("rename");
  return (
    <div className="w-fit py-2 px-3">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-fit h-fit text-slate-800  font-medium hover:text-purple-500 focus:text-purple-500">
            <MoreHorizontal className="w-6 h-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 flex flex-col gap-2">
            <DialogTrigger asChild>
              <DropdownMenuItem
                onClick={() => setActionType("rename")}
                className="rounded-md gap-2 w-full inline-flex items-center justify-center text-slate-800 font-medium"
              >
                <Pencil className="h-4 w-4" /> rename
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onClick={() => setActionType("delete")}
                className="rounded-md  gap-2 w-full  bg-red-500 inline-flex items-center justify-center text-white font-medium"
              >
                <Trash2 className="h-4 w-4" /> delete
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <UpdateTargetAction actionType={actionType} target={target} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UpdateTargetAction({
  actionType,
  target,
}: {
  actionType: "rename" | "delete";
  target: TargetWithTasks;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [targetNewName, setTargetNewName] = useState(target.goal_target_name);
  const router = useRouter();
  const { handleError } = useError();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const actionDetails = targetActionsSchema.parse({
        targetActionType: actionType,
        targetNewName,
      });

      await fetchDataFromApi({
        url: `/api/goals/targets/actions/?target_id=${target.goal_target_id}`,
        method: "PUT",
        body: JSON.stringify(actionDetails),
      });

      toast({
        type: "success",
        message:
          actionType === "delete"
            ? "succesfully deleted this task"
            : "this task has been renamed",
      });
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {actionType === "delete" ? (
        <div className="flex items-center gap-2 flex-col">
          <FormHeader
            description="This action cannot be undone we will delete this task from our database"
            heading="Delete this task"
          />
          <button className="outline-none rounded-md  h-10 py-2 px-2 gap-2 w-24 ml-auto  bg-red-500 inline-flex items-center justify-center text-white font-medium">
            {isLoading && <Loader2 className=" h-4 w-4 animate-spin" />} delete
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-col">
          <FormHeader
            description="Want to change the name of your task, you're in the right place"
            heading="Rename task"
          />
          <Input
            type="text"
            value={targetNewName}
            onChange={(e) => setTargetNewName(e.target.value)}
            label="target name"
            placeholder="enter new name"
          />
          <Button size="default" variant="default" isLoading={isLoading}>
            submit
          </Button>
        </div>
      )}
    </form>
  );
}

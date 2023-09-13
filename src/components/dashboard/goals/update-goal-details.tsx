"use client";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modals";
import { Pencil, Plus } from "lucide-react";
import React from "react";
import AddGoalForm from "./add-goal-form";
import UpdateGoalForm from "./update-goal-form";
import { Goal } from "@prisma/client";

type Props = { goal: Goal };

export default function UpdateGoal({ goal }: Props) {
  return (
    <Modal
      button={
        <button className="inline-flex items-center justify-cente r outline-none">
          <Pencil className="h-5 w-5 text-blue-300 hover:text-blue-500" />
        </button>
      }
      title="Set a new goal"
      description="Woo!! Always aim high let's create a new goal"
      contentClassName="max-w-md"
    >
      <UpdateGoalForm goal={goal} />
    </Modal>
  );
}

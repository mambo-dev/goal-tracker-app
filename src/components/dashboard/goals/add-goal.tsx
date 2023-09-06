"use client";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modals";
import { Plus } from "lucide-react";
import React from "react";
import AddGoalForm from "./add-goal-form";

type Props = {};

export default function AddGoal({}: Props) {
  return (
    <Modal
      button={
        <Button size="default" variant="default" className="gap-3">
          <Plus /> Add goal
        </Button>
      }
      title="Set a new goal"
      description="Woo!! Always aim high let's create a new goal"
      contentClassName="max-w-md"
    >
      <AddGoalForm />
    </Modal>
  );
}

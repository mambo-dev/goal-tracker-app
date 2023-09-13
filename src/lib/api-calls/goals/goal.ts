import { createGoalSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";

type GoalDetails = {
  goalTitle: string;
  goalDescription?: string;
  goalTimeline?: Date;
};
type EditGoalDetails = {
  goalTitle?: string;
  goalDescription?: string;
  goalTimeline?: Date;
};

export default async function createGoal(goalDetails: GoalDetails) {
  const res = await fetch(`/api/goals/create`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(goalDetails),
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (!data.okay) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }

  return data.data;
}

export async function setAchieved(goalId: number) {
  const res = await fetch(`/api/goals/edit/set-achieved?goalId=${goalId}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (!data.okay) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }

  return data.data;
}

export async function deleteGoal(goalId: number) {
  const res = await fetch(`/api/goals/edit/delete-goal?goalId=${goalId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (!data.okay) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }

  return data.data;
}

export async function editGoal(editGoalInput: {
  goalDetails: EditGoalDetails;
  goalId: number;
}) {
  const { goalDetails, goalId } = editGoalInput;
  const res = await fetch(`/api/goals/edit/update-details?goalId=${goalId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(goalDetails),
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (!data.okay) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }

  return data.data;
}

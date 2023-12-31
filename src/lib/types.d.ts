import {
  Goal,
  GoalTarget,
  SubGoal,
  TargetTasks,
  Type,
  User,
} from "@prisma/client";

export type ServerResponse<T> = {
  error?: ZodIssues[] | HandleError[];
  data?: T;
  okay: boolean;
};

type HandleError = {
  message: string;
};

export type AuthorizedUser = {
  user?: {
    user_id: number;
    username: string;
  };
  error?: string;
};

export type DecodedToken = {
  id: number;
  iat: number;
  exp: number;
};

export type UserExistsAndAuthorized = {
  message?: string;
  user: UserAndAccount | null;
};

export type UserAndAccount = {
  user_id: number;
  user_username: string;
  user_email: string;
  user_password: string;
  account_verified: boolean;
  account_two_factor: boolean;
};

type NavList = {
  name: string;
  link: string;
  streak?: number;
};
type SingleGoal = Goal & {
  goal_targets: GoalTarget[] & {
    goal_target_tasks: TargetTasks[];
  };
};

export type SingleGoalWithTargetsAndTasks = Goal & {
  goal_targets: (GoalTarget & {
    goal_target_tasks: GoalTargetTask[];
  })[];
};

export type TargetWithTasks = GoalTarget & {
  goal_target_tasks: GoalTargetTask[];
};

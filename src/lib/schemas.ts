import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(1, "please provide a username"),
    email: z
      .string()
      .min(1, "please provide an email")
      .email("provide a valid email"),
    password: z.string().min(1, "please provide a password"),
    confirmPassword: z
      .string()
      .min(1, "please provide a confirmation password"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  username: z.string().min(1, "please provide a username"),

  password: z.string().min(1, "please provide a password"),
});

export const requestResetSchema = z.object({
  email: z
    .string()
    .min(1, "please provide an email")
    .email("provide a valid email"),
});

export const twoFactorSchema = z.object({
  twoFactorCode: z
    .string()
    .min(1, "please provide the code sent in your email"),
});

export const verifyEmailSchema = z.object({
  verificationCode: z
    .string()
    .min(1, "please provide the code sent in your email"),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(1, "please provide a password"),
    resetCode: z.string().min(1, "please provide a reset code "),
    confirmPassword: z
      .string()
      .min(1, "please provide a confirmation password"),
    email: z
      .string()
      .min(1, "please provide an email")
      .email("provide a valid email"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createGoalSchema = z.object({
  goalTitle: z.string().min(1, "please provide a goal title"),
  goalDescription: z.string().optional(),
  goalTimeline: z.date().optional(),
});

export const editGoalSchema = z.object({
  goalTitle: z.string().optional(),
  goalDescription: z.string().optional(),
  goalTimeline: z.date().optional(),
});

export const createSubGoalSchema = z.object({
  subGoalTitle: z.string().min(1, "you need to provide a title for subgoals"),
  subGoalTimeline: z.date({
    required_error: "a timeline for this sub goal is",
  }),
  subGoalAchieved: z.boolean().default(true),
});

export const editSubGoalSchema = z.object({
  subGoalTitle: z
    .string({
      invalid_type_error: "please provide a string",
    })
    .optional(),
  subGoalTimeline: z.date().optional(),
  subGoalAchieved: z.boolean().default(true),
});

export const createTargetSchema = z.object({
  targetType: z.enum(["number", "curency", "milestone", "done_not_done"], {
    required_error: "a target type must be provided",
  }),
  targetName: z
    .string({ required_error: "the name of the target must be provided" })
    .min(1, "please enter a target name"),
  currencyTarget: z
    .object({
      startValue: z.number({
        required_error: "please provide an end value",
      }),
      endValue: z.number({
        required_error: "please provide an end value",
      }),
    })
    .optional(),
  numericTarget: z
    .object({
      startValue: z.number({
        required_error: "please provide an end value",
      }),
      endValue: z.number({
        required_error: "please provide an end value",
      }),
    })
    .optional(),
  mileStones: z
    .array(
      z.object({
        name: z.string().min(1, "please provide a name for your milestone"),
      })
    )
    .optional(),
  doneNotDone: z.boolean().optional(),
});

export const editTargetSchema = z.object({
  targetType: z.enum(["number", "curency", "milestone", "done_not_done"], {
    required_error: "a target type must be provided",
  }),
  status: z.enum(["finished", "inProgress", "increase", "decrease"]).optional(),
  targetName: z
    .string({ required_error: "the name of the target must be provided" })
    .min(1, "please enter a target name")
    .optional(),
  newTarget: z.number().optional(),
});

export const updateTaskSchema = z.object({
  taskActionType: z.enum(["check", "delete"]),
});

export const targetActionsSchema = z.object({
  targetActionType: z.enum(["rename", "delete"]),
  targetNewName: z.string().min(1, "a name is required").optional(),
});

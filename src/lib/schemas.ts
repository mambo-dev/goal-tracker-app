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
  goalUserTimeline: z.date({
    required_error: "a date timeline is required",
  }),
  goalType: z.enum(["daily", "weekly", "monthly", "yearly"]),
});

export const editGoalSchema = z.object({
  goalTitle: z.string().optional(),
  goalUserTimeline: z.date(),
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

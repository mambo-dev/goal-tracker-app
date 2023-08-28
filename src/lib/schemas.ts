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
  goalTypeTimeline: z
    .date({
      invalid_type_error: "provide type of date",
    })
    .default(new Date()),
  goalAchieved: z.boolean().default(false),
  goalType: z.enum(["daily", "weekly", "monthly", "yearly"]),
});

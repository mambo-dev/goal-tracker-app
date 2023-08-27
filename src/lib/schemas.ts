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

export const requestResetSchema = z.object({
  email: z
    .string()
    .min(1, "please provide an email")
    .email("provide a valid email"),
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

import { z } from "zod";

export const loginBodySchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const loginSchema = {
  body: loginBodySchema,
};

export type LoginInput = z.infer<typeof loginBodySchema>;

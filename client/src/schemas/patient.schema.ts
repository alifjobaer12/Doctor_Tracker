import { z } from "zod";

export const patientFormSchema = z.object({
  name: z.string().trim().min(2, "Patient name must be at least 2 characters").max(100),
  age: z.number().int().min(0, "Age cannot be negative").max(120, "Age cannot exceed 120"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  phone: z.string().trim().min(5, "Valid phone number is required").max(30),
  email: z.string().trim().email("Invalid email address").toLowerCase().optional().or(z.literal("")),
  condition: z.string().trim().min(2, "Condition is required").max(100),
  status: z.enum(["active", "recovered", "critical"]),
  notes: z.string().trim().max(1000).optional(),
  doctor: z.string().min(1, "Please assign a doctor"),
  admittedAt: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

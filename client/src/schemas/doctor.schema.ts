import { z } from "zod";

export const doctorFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  specialization: z.string().trim().min(2, "Specialization is required").max(100),
  hospital: z.string().trim().min(2, "Hospital is required").max(120),
  phone: z.string().trim().min(5, "Valid phone number is required").max(30),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;

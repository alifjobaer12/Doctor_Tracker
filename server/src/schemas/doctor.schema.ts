import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const doctorParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid Doctor ID format"),
});

export const createDoctorBodySchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    specialization: z.string().trim().min(2, "Specialization is required").max(100),
    hospital: z.string().trim().min(2, "Hospital is required").max(120),
    phone: z.string().trim().min(5, "Valid phone number is required").max(30),
    email: z.string().trim().email("Invalid email address").toLowerCase(),
  })
  .strict();

export const updateDoctorBodySchema = createDoctorBodySchema.partial();

export const listDoctorsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  hospital: z.string().trim().optional(),
  createdFrom: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
  createdTo: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
  sortBy: z.enum(["createdAt", "name", "patientsCount"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const deleteDoctorQuerySchema = z.object({
  cascade: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
});

export const doctorSchemas = {
  getById: {
    params: doctorParamsSchema,
  },
  create: {
    body: createDoctorBodySchema,
  },
  update: {
    params: doctorParamsSchema,
    body: updateDoctorBodySchema,
  },
  delete: {
    params: doctorParamsSchema,
    query: deleteDoctorQuerySchema,
  },
  list: {
    query: listDoctorsQuerySchema,
  },
};

export type CreateDoctorInput = z.infer<typeof createDoctorBodySchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorBodySchema>;
export type ListDoctorsQuery = z.infer<typeof listDoctorsQuerySchema>;

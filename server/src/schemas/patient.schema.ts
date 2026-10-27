import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const patientParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid Patient ID format"),
});

export const doctorPatientParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid Doctor ID format"),
  patientId: z.string().regex(objectIdRegex, "Invalid Patient ID format"),
});

export const doctorIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid Doctor ID format"),
});

export const createPatientBodySchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    age: z.coerce.number().int().min(0, "Age cannot be negative").max(120, "Age cannot exceed 120"),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Gender must be male, female, or other" }),
    }),
    phone: z.string().trim().min(5, "Valid phone number is required").max(30),
    email: z.string().trim().email("Invalid email address").toLowerCase().optional().or(z.literal("")),
    condition: z.string().trim().min(2, "Medical condition is required").max(100),
    status: z.enum(["active", "recovered", "critical"]).default("active"),
    notes: z.string().trim().max(1000).optional(),
    doctor: z.string().regex(objectIdRegex, "Valid assigned Doctor ID is required"),
    admittedAt: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
  })
  .strict();

export const updatePatientBodySchema = createPatientBodySchema.partial();

export const listPatientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().optional(),
  condition: z.string().trim().optional(),
  status: z.enum(["active", "recovered", "critical"]).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  doctor: z.string().regex(objectIdRegex).optional(),
  admittedFrom: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
  admittedTo: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
  sortBy: z.enum(["admittedAt", "name", "age"]).default("admittedAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const patientSchemas = {
  getById: {
    params: patientParamsSchema,
  },
  create: {
    body: createPatientBodySchema,
  },
  update: {
    params: patientParamsSchema,
    body: updatePatientBodySchema,
  },
  delete: {
    params: patientParamsSchema,
  },
  list: {
    query: listPatientsQuerySchema,
  },
  doctorPatientsList: {
    params: doctorIdParamSchema,
    query: listPatientsQuerySchema.omit({ doctor: true }),
  },
  createDoctorPatient: {
    params: doctorIdParamSchema,
    body: createPatientBodySchema.omit({ doctor: true }),
  },
  deleteDoctorPatient: {
    params: doctorPatientParamsSchema,
  },
};

export type CreatePatientInput = z.infer<typeof createPatientBodySchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientBodySchema>;
export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>;

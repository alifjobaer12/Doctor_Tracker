import { z } from "zod";

export const timelineQuerySchema = z.object({
  range: z.enum(["7d", "30d", "90d", "12m"]).default("30d"),
  groupBy: z.enum(["day", "week", "month"]).optional(),
});

export const patientsPerDoctorQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(25).default(10),
});

export const analyticsSchemas = {
  timeline: {
    query: timelineQuerySchema,
  },
  patientsPerDoctor: {
    query: patientsPerDoctorQuerySchema,
  },
};

export type TimelineQuery = z.infer<typeof timelineQuerySchema>;
export type PatientsPerDoctorQuery = z.infer<typeof patientsPerDoctorQuerySchema>;

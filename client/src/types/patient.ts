import { Doctor } from "./doctor";

export type PatientGender = "male" | "female" | "other";
export type PatientStatus = "active" | "recovered" | "critical";

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email?: string;
  condition: string;
  status: PatientStatus;
  notes?: string;
  doctor: Doctor | { _id: string; name: string; specialization: string; hospital?: string };
  admittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFilters {
  conditions: string[];
  statuses: PatientStatus[];
  genders: PatientGender[];
}

export interface PatientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  status?: PatientStatus;
  gender?: PatientGender;
  doctor?: string;
  admittedFrom?: string;
  admittedTo?: string;
  sortBy?: "admittedAt" | "name" | "age";
  order?: "asc" | "desc";
}

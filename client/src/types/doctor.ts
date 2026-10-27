export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFilters {
  specializations: string[];
  hospitals: string[];
}

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: "createdAt" | "name" | "patientsCount";
  order?: "asc" | "desc";
}

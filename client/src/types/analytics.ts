export interface SummaryStats {
  totalDoctors: number;
  totalPatients: number;
  avgPatientsPerDoctor: number;
  patientsThisMonth: number;
  patientsLastMonth: number;
  monthChangePct: number;
}

export interface TimelineDataPoint {
  date: string;
  label: string;
  count: number;
}

export interface PatientsPerDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  patientsCount: number;
}

export interface ConditionStat {
  condition: string;
  count: number;
  percentage: number;
}

export interface SpecializationStat {
  specialization: string;
  count: number;
}

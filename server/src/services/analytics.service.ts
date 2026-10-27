import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { TimelineQuery } from "../schemas/analytics.schema.js";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds in-memory cache

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function clearAnalyticsCache(): void {
  cache.clear();
}

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

export interface ConditionStat {
  condition: string;
  count: number;
  percentage: number;
}

export interface SpecializationStat {
  specialization: string;
  count: number;
}

export class AnalyticsService {
  static async getSummary(): Promise<SummaryStats> {
    const cacheKey = "analytics:summary";
    const cached = getCached<SummaryStats>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalDoctors, totalPatients, patientsThisMonth, patientsLastMonth] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Patient.countDocuments({
        admittedAt: { $gte: startOfCurrentMonth, $lte: now },
      }),
      Patient.countDocuments({
        admittedAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
      }),
    ]);

    const avgPatientsPerDoctor =
      totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;

    let monthChangePct = 0;
    if (patientsLastMonth > 0) {
      monthChangePct = Number(
        (((patientsThisMonth - patientsLastMonth) / patientsLastMonth) * 100).toFixed(1)
      );
    } else if (patientsThisMonth > 0) {
      monthChangePct = 100;
    }

    const summary: SummaryStats = {
      totalDoctors,
      totalPatients,
      avgPatientsPerDoctor,
      patientsThisMonth,
      patientsLastMonth,
      monthChangePct,
    };

    setCached(cacheKey, summary);
    return summary;
  }

  static async getPatientsPerDoctor(limit = 10) {
    const cacheKey = `analytics:patients-per-doctor:${limit}`;
    const cached = getCached<Array<{ name: string; specialization: string; hospital: string; patientsCount: number }>>(cacheKey);
    if (cached) return cached;

    const doctors = await Doctor.find()
      .sort({ patientsCount: -1 })
      .limit(limit)
      .select("name specialization hospital patientsCount")
      .lean();

    setCached(cacheKey, doctors);
    return doctors;
  }

  static async getTimeline(query: TimelineQuery): Promise<TimelineDataPoint[]> {
    const range = query.range || "30d";
    const cacheKey = `analytics:timeline:${range}`;
    const cached = getCached<TimelineDataPoint[]>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const startDate = new Date();
    let isMonthly = false;

    if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "90d") {
      startDate.setDate(now.getDate() - 90);
    } else if (range === "12m") {
      startDate.setMonth(now.getMonth() - 11);
      startDate.setDate(1);
      isMonthly = true;
    } else {
      // 30d default
      startDate.setDate(now.getDate() - 30);
    }

    const formatString = isMonthly ? "%Y-%m" : "%Y-%m-%d";

    const aggregated = await Patient.aggregate<{ _id: string; count: number }>([
      {
        $match: {
          admittedAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: formatString, date: "$admittedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const countMap = new Map<string, number>();
    for (const item of aggregated) {
      countMap.set(item._id, item.count);
    }

    // Zero-fill missing buckets
    const result: TimelineDataPoint[] = [];
    const iter = new Date(startDate);

    if (isMonthly) {
      for (let i = 0; i < 12; i++) {
        const key = `${iter.getFullYear()}-${String(iter.getMonth() + 1).padStart(2, "0")}`;
        const label = iter.toLocaleString("en-US", { month: "short", year: "2-digit" });
        result.push({
          date: key,
          label,
          count: countMap.get(key) || 0,
        });
        iter.setMonth(iter.getMonth() + 1);
      }
    } else {
      while (iter <= now) {
        const key = iter.toISOString().split("T")[0];
        const label = iter.toLocaleString("en-US", { month: "short", day: "numeric" });
        result.push({
          date: key,
          label,
          count: countMap.get(key) || 0,
        });
        iter.setDate(iter.getDate() + 1);
      }
    }

    setCached(cacheKey, result);
    return result;
  }

  static async getConditions(): Promise<ConditionStat[]> {
    const cacheKey = "analytics:conditions";
    const cached = getCached<ConditionStat[]>(cacheKey);
    if (cached) return cached;

    const aggregated = await Patient.aggregate<{ _id: string; count: number }>([
      {
        $group: {
          _id: "$condition",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const totalPatients = aggregated.reduce((acc, curr) => acc + curr.count, 0);

    const topCount = 6;
    const topConditions = aggregated.slice(0, topCount);
    const otherConditions = aggregated.slice(topCount);

    const result: ConditionStat[] = topConditions.map((item) => ({
      condition: item._id,
      count: item.count,
      percentage: totalPatients > 0 ? Number(((item.count / totalPatients) * 100).toFixed(1)) : 0,
    }));

    if (otherConditions.length > 0) {
      const otherTotal = otherConditions.reduce((acc, curr) => acc + curr.count, 0);
      result.push({
        condition: "Other",
        count: otherTotal,
        percentage: totalPatients > 0 ? Number(((otherTotal / totalPatients) * 100).toFixed(1)) : 0,
      });
    }

    setCached(cacheKey, result);
    return result;
  }

  static async getSpecializations(): Promise<SpecializationStat[]> {
    const cacheKey = "analytics:specializations";
    const cached = getCached<SpecializationStat[]>(cacheKey);
    if (cached) return cached;

    const aggregated = await Doctor.aggregate<{ _id: string; count: number }>([
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const result: SpecializationStat[] = aggregated.map((item) => ({
      specialization: item._id,
      count: item.count,
    }));

    setCached(cacheKey, result);
    return result;
  }
}

import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TimelineQuery, PatientsPerDoctorQuery } from "../schemas/analytics.schema.js";

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await AnalyticsService.getSummary();
  res.status(200).json({
    success: true,
    data: summary,
  });
});

export const getPatientsPerDoctor = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as PatientsPerDoctorQuery;
  const limit = query.limit ? Number(query.limit) : 10;
  const doctors = await AnalyticsService.getPatientsPerDoctor(limit);

  res.status(200).json({
    success: true,
    data: doctors,
  });
});

export const getTimeline = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as TimelineQuery;
  const timeline = await AnalyticsService.getTimeline(query);

  res.status(200).json({
    success: true,
    data: timeline,
  });
});

export const getConditions = asyncHandler(async (_req: Request, res: Response) => {
  const conditions = await AnalyticsService.getConditions();

  res.status(200).json({
    success: true,
    data: conditions,
  });
});

export const getSpecializations = asyncHandler(async (_req: Request, res: Response) => {
  const specializations = await AnalyticsService.getSpecializations();

  res.status(200).json({
    success: true,
    data: specializations,
  });
});

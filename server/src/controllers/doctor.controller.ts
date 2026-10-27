import { Request, Response } from "express";
import { DoctorService } from "../services/doctor.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ListDoctorsQuery } from "../schemas/doctor.schema.js";

export const getDoctors = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListDoctorsQuery;
  const { doctors, meta } = await DoctorService.listDoctors(query);

  res.status(200).json({
    success: true,
    data: doctors,
    meta,
  });
});

export const getDoctorById = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await DoctorService.getDoctorById(req.params.id);

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await DoctorService.createDoctor(req.body);

  res.status(201).json({
    success: true,
    data: doctor,
  });
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await DoctorService.updateDoctor(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
  const cascade = req.query.cascade === "true";
  await DoctorService.deleteDoctor(req.params.id, cascade);

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});

export const getDoctorFilters = asyncHandler(async (_req: Request, res: Response) => {
  const filters = await DoctorService.getFilterOptions();

  res.status(200).json({
    success: true,
    data: filters,
  });
});

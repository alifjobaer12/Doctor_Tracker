import { Request, Response } from "express";
import { PatientService } from "../services/patient.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ListPatientsQuery } from "../schemas/patient.schema.js";

export const getPatients = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListPatientsQuery;
  const { patients, meta } = await PatientService.listPatients(query);

  res.status(200).json({
    success: true,
    data: patients,
    meta,
  });
});

export const getPatientById = asyncHandler(async (req: Request, res: Response) => {
  const patient = await PatientService.getPatientById(req.params.id);

  res.status(200).json({
    success: true,
    data: patient,
  });
});

export const createPatient = asyncHandler(async (req: Request, res: Response) => {
  const patient = await PatientService.createPatient(req.body);

  res.status(201).json({
    success: true,
    data: patient,
  });
});

export const updatePatient = asyncHandler(async (req: Request, res: Response) => {
  const patient = await PatientService.updatePatient(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: patient,
  });
});

export const deletePatient = asyncHandler(async (req: Request, res: Response) => {
  await PatientService.deletePatient(req.params.id);

  res.status(200).json({
    success: true,
    message: "Patient deleted successfully",
  });
});

export const getPatientFilters = asyncHandler(async (_req: Request, res: Response) => {
  const filters = await PatientService.getFilterOptions();

  res.status(200).json({
    success: true,
    data: filters,
  });
});

// Doctor-scoped patient endpoints
export const getDoctorPatients = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    ...(req.query as unknown as ListPatientsQuery),
    doctor: req.params.id,
  };

  const { patients, meta } = await PatientService.listPatients(query);

  res.status(200).json({
    success: true,
    data: patients,
    meta,
  });
});

export const createDoctorPatient = asyncHandler(async (req: Request, res: Response) => {
  const input = {
    ...req.body,
    doctor: req.params.id,
  };

  const patient = await PatientService.createPatient(input);

  res.status(201).json({
    success: true,
    data: patient,
  });
});

export const deleteDoctorPatient = asyncHandler(async (req: Request, res: Response) => {
  await PatientService.deleteDoctorPatient(req.params.id, req.params.patientId);

  res.status(200).json({
    success: true,
    message: "Patient removed from doctor's list successfully",
  });
});

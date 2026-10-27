import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientFilters,
} from "../controllers/patient.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { patientSchemas } from "../schemas/patient.schema.js";

const router = Router();

// All patient routes require admin authorization
router.use(authenticate, authorize("admin"));

// Distinct filters
router.get("/filters", getPatientFilters);

// List patients
router.get("/", validate(patientSchemas.list), getPatients);

// Create patient
router.post("/", validate(patientSchemas.create), createPatient);

// Detail, Update, Delete
router.get("/:id", validate(patientSchemas.getById), getPatientById);
router.patch("/:id", validate(patientSchemas.update), updatePatient);
router.delete("/:id", validate(patientSchemas.delete), deletePatient);

export default router;

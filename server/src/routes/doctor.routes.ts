import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorFilters,
} from "../controllers/doctor.controller.js";
import {
  getDoctorPatients,
  createDoctorPatient,
  deleteDoctorPatient,
} from "../controllers/patient.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { doctorSchemas } from "../schemas/doctor.schema.js";
import { patientSchemas } from "../schemas/patient.schema.js";

const router = Router();

// All doctor routes are protected
router.use(authenticate, authorize("admin"));

// Distinct filter options (must precede /:id)
router.get("/filters", getDoctorFilters);

// List doctors
router.get("/", validate(doctorSchemas.list), getDoctors);

// Create doctor
router.post("/", validate(doctorSchemas.create), createDoctor);

// Detail, Update, Delete by ID
router.get("/:id", validate(doctorSchemas.getById), getDoctorById);
router.patch("/:id", validate(doctorSchemas.update), updateDoctor);
router.delete("/:id", validate(doctorSchemas.delete), deleteDoctor);

// Doctor-scoped patients sub-resources
router.get("/:id/patients", validate(patientSchemas.doctorPatientsList), getDoctorPatients);
router.post("/:id/patients", validate(patientSchemas.createDoctorPatient), createDoctorPatient);
router.delete("/:id/patients/:patientId", validate(patientSchemas.deleteDoctorPatient), deleteDoctorPatient);

export default router;

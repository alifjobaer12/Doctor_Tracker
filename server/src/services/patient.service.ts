import { FilterQuery, Types } from "mongoose";
import { Patient, IPatient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex } from "../utils/escapeRegex.js";
import { buildPaginationMeta, getPagination, PaginationMeta } from "../utils/pagination.js";
import { CreatePatientInput, ListPatientsQuery, UpdatePatientInput } from "../schemas/patient.schema.js";

export class PatientService {
  static async listPatients(query: ListPatientsQuery): Promise<{ patients: IPatient[]; meta: PaginationMeta }> {
    const { page, limit, skip } = getPagination(query.page, query.limit);
    const filter: FilterQuery<IPatient> = {};

    // 1. Anchored prefix search
    if (query.search) {
      const escaped = escapeRegex(query.search.toLowerCase().trim());
      const prefixRegex = new RegExp(`^${escaped}`);
      filter.$or = [
        { nameLower: prefixRegex },
        { phone: prefixRegex },
        { email: prefixRegex },
      ];
    }

    // 2. Exact match filters
    if (query.condition) {
      filter.condition = query.condition;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.gender) {
      filter.gender = query.gender;
    }

    if (query.doctor) {
      filter.doctor = new Types.ObjectId(query.doctor);
    }

    // 3. Admission date range
    if (query.admittedFrom || query.admittedTo) {
      filter.admittedAt = {};
      if (query.admittedFrom) {
        filter.admittedAt.$gte = new Date(query.admittedFrom);
      }
      if (query.admittedTo) {
        const toDate = new Date(query.admittedTo);
        if (query.admittedTo.length <= 10) {
          toDate.setHours(23, 59, 59, 999);
        }
        filter.admittedAt.$lte = toDate;
      }
    }

    // 4. Sorting
    const sortField = query.sortBy || "admittedAt";
    const sortOrder = query.order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };
    if (sortField !== "admittedAt") {
      sort.admittedAt = -1;
    }

    // 5. Parallel execution of find and count with lean & doctor population
    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .populate("doctor", "name specialization hospital")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean<IPatient[]>(),
      Patient.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(total, page, limit);

    return { patients, meta };
  }

  static async getPatientById(id: string): Promise<IPatient> {
    const patient = await Patient.findById(id)
      .populate("doctor", "name specialization hospital")
      .select("-__v")
      .lean<IPatient>();

    if (!patient) {
      throw ApiError.notFound("Patient not found");
    }
    return patient;
  }

  static async createPatient(input: CreatePatientInput): Promise<IPatient> {
    const doctor = await Doctor.findById(input.doctor);
    if (!doctor) {
      throw ApiError.notFound("Assigned doctor does not exist");
    }

    const patient = await Patient.create({
      ...input,
      email: input.email || undefined,
      nameLower: input.name.toLowerCase().trim(),
      admittedAt: input.admittedAt ? new Date(input.admittedAt) : new Date(),
    });

    // Atomic increment of doctor patientsCount
    await Doctor.findByIdAndUpdate(input.doctor, { $inc: { patientsCount: 1 } });

    const populated = await Patient.findById(patient._id)
      .populate("doctor", "name specialization hospital")
      .select("-__v")
      .lean<IPatient>();

    return populated!;
  }

  static async updatePatient(id: string, input: UpdatePatientInput): Promise<IPatient> {
    const currentPatient = await Patient.findById(id);
    if (!currentPatient) {
      throw ApiError.notFound("Patient not found");
    }

    const updateData: Record<string, unknown> = { ...input };

    if (input.email === "") {
      updateData.email = undefined;
    }

    if (input.name) {
      updateData.nameLower = input.name.toLowerCase().trim();
    }

    if (input.admittedAt) {
      updateData.admittedAt = new Date(input.admittedAt);
    }

    if (input.doctor) {
      updateData.doctor = new Types.ObjectId(input.doctor);
    }

    // Handle doctor reassignment
    const doctorChanged = input.doctor && input.doctor.toString() !== currentPatient.doctor.toString();

    if (doctorChanged) {
      const newDoctor = await Doctor.findById(input.doctor);
      if (!newDoctor) {
        throw ApiError.notFound("New assigned doctor does not exist");
      }
    }

    const updated = await Patient.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("doctor", "name specialization hospital")
      .select("-__v")
      .lean<IPatient>();

    if (doctorChanged) {
      await Promise.all([
        Doctor.findByIdAndUpdate(currentPatient.doctor, { $inc: { patientsCount: -1 } }),
        Doctor.findByIdAndUpdate(input.doctor, { $inc: { patientsCount: 1 } }),
      ]);
    }

    return updated!;
  }

  static async deletePatient(id: string): Promise<void> {
    const patient = await Patient.findById(id);
    if (!patient) {
      throw ApiError.notFound("Patient not found");
    }

    await Patient.findByIdAndDelete(id);

    // Atomic decrement of doctor's patients count
    await Doctor.findByIdAndUpdate(patient.doctor, { $inc: { patientsCount: -1 } });
  }

  static async deleteDoctorPatient(doctorId: string, patientId: string): Promise<void> {
    const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
    if (!patient) {
      throw ApiError.notFound("Patient not found under this doctor");
    }

    await Patient.findByIdAndDelete(patientId);
    await Doctor.findByIdAndUpdate(doctorId, { $inc: { patientsCount: -1 } });
  }

  static async getFilterOptions(): Promise<{ conditions: string[]; statuses: string[]; genders: string[] }> {
    const conditions = await Patient.distinct("condition");
    return {
      conditions: (conditions as string[]).sort(),
      statuses: ["active", "recovered", "critical"],
      genders: ["male", "female", "other"],
    };
  }
}

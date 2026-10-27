import { FilterQuery } from "mongoose";
import { Doctor, IDoctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex } from "../utils/escapeRegex.js";
import { buildPaginationMeta, getPagination, PaginationMeta } from "../utils/pagination.js";
import { CreateDoctorInput, ListDoctorsQuery, UpdateDoctorInput } from "../schemas/doctor.schema.js";

export class DoctorService {
  static async listDoctors(query: ListDoctorsQuery): Promise<{ doctors: IDoctor[]; meta: PaginationMeta }> {
    const { page, limit, skip } = getPagination(query.page, query.limit);
    const filter: FilterQuery<IDoctor> = {};

    // 1. Anchored prefix search (index-friendly)
    if (query.search) {
      const escaped = escapeRegex(query.search.toLowerCase().trim());
      const prefixRegex = new RegExp(`^${escaped}`);
      filter.$or = [
        { nameLower: prefixRegex },
        { email: prefixRegex },
        { phone: prefixRegex },
      ];
    }

    // 2. Exact match filters
    if (query.specialization) {
      filter.specialization = query.specialization;
    }

    if (query.hospital) {
      filter.hospital = query.hospital;
    }

    // 3. Date range filters
    if (query.createdFrom || query.createdTo) {
      filter.createdAt = {};
      if (query.createdFrom) {
        filter.createdAt.$gte = new Date(query.createdFrom);
      }
      if (query.createdTo) {
        // Include full day if date-only format
        const toDate = new Date(query.createdTo);
        if (query.createdTo.length <= 10) {
          toDate.setHours(23, 59, 59, 999);
        }
        filter.createdAt.$lte = toDate;
      }
    }

    // 4. Sorting
    const sortField = query.sortBy || "createdAt";
    const sortOrder = query.order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    // Secondary sort for deterministic pagination
    if (sortField !== "createdAt") {
      sort.createdAt = -1;
    }

    // 5. Parallel execution of find and count
    const [doctors, total] = await Promise.all([
      Doctor.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean<IDoctor[]>(),
      Doctor.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(total, page, limit);

    return { doctors, meta };
  }

  static async getDoctorById(id: string): Promise<IDoctor> {
    const doctor = await Doctor.findById(id).select("-__v").lean<IDoctor>();
    if (!doctor) {
      throw ApiError.notFound("Doctor not found");
    }
    return doctor;
  }

  static async createDoctor(input: CreateDoctorInput): Promise<IDoctor> {
    const existing = await Doctor.findOne({ email: input.email.toLowerCase().trim() });
    if (existing) {
      throw ApiError.conflict(`A doctor with email ${input.email} already exists`);
    }

    const doctor = await Doctor.create({
      ...input,
      nameLower: input.name.toLowerCase().trim(),
      patientsCount: 0,
    });

    return doctor.toObject();
  }

  static async updateDoctor(id: string, input: UpdateDoctorInput): Promise<IDoctor> {
    if (input.email) {
      const existing = await Doctor.findOne({
        email: input.email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (existing) {
        throw ApiError.conflict(`A doctor with email ${input.email} already exists`);
      }
    }

    const updateData: Partial<IDoctor> & Record<string, unknown> = { ...input };
    if (input.name) {
      updateData.nameLower = input.name.toLowerCase().trim();
    }

    const updated = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .lean<IDoctor>();

    if (!updated) {
      throw ApiError.notFound("Doctor not found");
    }

    return updated;
  }

  static async deleteDoctor(id: string, cascade = false): Promise<void> {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      throw ApiError.notFound("Doctor not found");
    }

    // Check referential integrity
    const patientsCount = await Patient.countDocuments({ doctor: id });

    if (patientsCount > 0 && !cascade) {
      throw ApiError.conflict(
        `Cannot delete doctor. Doctor has ${patientsCount} assigned patient(s). Pass cascade=true to delete associated patients.`,
        [
          {
            field: "patientsCount",
            message: `Doctor has ${patientsCount} assigned patient(s)`,
          },
        ]
      );
    }

    if (cascade && patientsCount > 0) {
      await Patient.deleteMany({ doctor: id });
    }

    await Doctor.findByIdAndDelete(id);
  }

  static async getFilterOptions(): Promise<{ specializations: string[]; hospitals: string[] }> {
    const [specializations, hospitals] = await Promise.all([
      Doctor.distinct("specialization"),
      Doctor.distinct("hospital"),
    ]);

    return {
      specializations: (specializations as string[]).sort(),
      hospitals: (hospitals as string[]).sort(),
    };
  }
}

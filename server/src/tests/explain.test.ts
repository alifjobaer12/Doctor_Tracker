import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { env } from "../config/env.js";
import { escapeRegex } from "../utils/escapeRegex.js";

describe("Query Optimization & Index Verification (no COLLSCAN)", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  function hasCollscan(stage: Record<string, unknown>): boolean {
    if (stage.stage === "COLLSCAN") return true;
    if (stage.inputStage) {
      if (hasCollscan(stage.inputStage as Record<string, unknown>)) return true;
    }
    if (Array.isArray(stage.inputStages)) {
      for (const s of stage.inputStages) {
        if (hasCollscan(s as Record<string, unknown>)) return true;
      }
    }
    return false;
  }

  it("should use index for Doctor email unique lookup", async () => {
    const explain = (await Doctor.findOne({ email: "admin@doctortracker.com" }).explain(
      "executionStats"
    )) as unknown as { executionStats: { executionStages: Record<string, unknown> } };

    const stages = explain.executionStats.executionStages;
    expect(hasCollscan(stages)).toBe(false);
  });

  it("should use index for Doctor prefix search on nameLower", async () => {
    const term = escapeRegex("dr. sarah");
    const explain = (await Doctor.find({ nameLower: new RegExp(`^${term}`) }).explain(
      "executionStats"
    )) as unknown as { executionStats: { executionStages: Record<string, unknown> } };

    const stages = explain.executionStats.executionStages;
    expect(hasCollscan(stages)).toBe(false);
  });

  it("should use compound index for Doctor specialization + createdAt", async () => {
    const explain = (await Doctor.find({ specialization: "Cardiology" })
      .sort({ createdAt: -1 })
      .explain("executionStats")) as unknown as {
      executionStats: { executionStages: Record<string, unknown> };
    };

    const stages = explain.executionStats.executionStages;
    expect(hasCollscan(stages)).toBe(false);
  });

  it("should use compound index for Patient doctor + admittedAt", async () => {
    const randomDoc = await Doctor.findOne();
    expect(randomDoc).not.toBeNull();

    const explain = (await Patient.find({ doctor: randomDoc!._id })
      .sort({ admittedAt: -1 })
      .explain("executionStats")) as unknown as {
      executionStats: { executionStages: Record<string, unknown> };
    };

    const stages = explain.executionStats.executionStages;
    expect(hasCollscan(stages)).toBe(false);
  });

  it("should use compound index for Patient condition + admittedAt", async () => {
    const explain = (await Patient.find({ condition: "Hypertension" })
      .sort({ admittedAt: -1 })
      .explain("executionStats")) as unknown as {
      executionStats: { executionStages: Record<string, unknown> };
    };

    const stages = explain.executionStats.executionStages;
    expect(hasCollscan(stages)).toBe(false);
  });
});

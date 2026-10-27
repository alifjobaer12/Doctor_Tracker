import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { env } from "../config/env.js";

describe("Analytics API Endpoints", () => {
  let adminCookie: string;

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@doctortracker.com", password: "Admin@12345" });

    adminCookie = loginRes.headers["set-cookie"][0];
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should return summary metrics with correct properties", async () => {
    const res = await request(app)
      .get("/api/v1/analytics/summary")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalDoctors).toBeGreaterThan(0);
    expect(res.body.data.totalPatients).toBeGreaterThan(0);
    expect(typeof res.body.data.avgPatientsPerDoctor).toBe("number");
    expect(typeof res.body.data.patientsThisMonth).toBe("number");
    expect(typeof res.body.data.monthChangePct).toBe("number");
  });

  it("should return top doctors by patient count", async () => {
    const res = await request(app)
      .get("/api/v1/analytics/patients-per-doctor?limit=5")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    if (res.body.data.length > 1) {
      expect(res.body.data[0].patientsCount).toBeGreaterThanOrEqual(res.body.data[1].patientsCount);
    }
  });

  it("should return continuous zero-filled timeline for 30d", async () => {
    const res = await request(app)
      .get("/api/v1/analytics/timeline?range=30d")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(30);
    expect(res.body.data[0]).toHaveProperty("date");
    expect(res.body.data[0]).toHaveProperty("count");
  });

  it("should return condition breakdown with percentages", async () => {
    const res = await request(app)
      .get("/api/v1/analytics/conditions")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("condition");
    expect(res.body.data[0]).toHaveProperty("percentage");
  });

  it("should return specialization statistics", async () => {
    const res = await request(app)
      .get("/api/v1/analytics/specializations")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("specialization");
    expect(res.body.data[0]).toHaveProperty("count");
  });
});

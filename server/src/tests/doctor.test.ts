import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { env } from "../config/env.js";

describe("Doctor API Endpoints", () => {
  let adminCookie: string;
  let testDoctorId: string;

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);

    // Login as admin to get auth cookie
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@doctortracker.com", password: "Admin@12345" });

    adminCookie = loginRes.headers["set-cookie"][0];
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should list doctors with pagination meta", async () => {
    const res = await request(app)
      .get("/api/v1/doctors?page=1&limit=5")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(5);
    expect(res.body.meta.total).toBeGreaterThan(0);
  });

  it("should return distinct filter options", async () => {
    const res = await request(app)
      .get("/api/v1/doctors/filters")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.specializations)).toBe(true);
    expect(Array.isArray(res.body.data.hospitals)).toBe(true);
    expect(res.body.data.specializations.length).toBeGreaterThan(0);
  });

  it("should create a new doctor", async () => {
    const uniqueEmail = `dr.test.${Date.now()}@example.com`;
    const res = await request(app)
      .post("/api/v1/doctors")
      .set("Cookie", adminCookie)
      .send({
        name: "Dr. Gregory House",
        specialization: "Diagnostic Medicine",
        hospital: "Princeton-Plainsboro",
        phone: "+1-555-0199",
        email: uniqueEmail,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Dr. Gregory House");
    expect(res.body.data.email).toBe(uniqueEmail);

    testDoctorId = res.body.data._id;
  });

  it("should fetch single doctor detail", async () => {
    const res = await request(app)
      .get(`/api/v1/doctors/${testDoctorId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(testDoctorId);
  });

  it("should update an existing doctor", async () => {
    const res = await request(app)
      .patch(`/api/v1/doctors/${testDoctorId}`)
      .set("Cookie", adminCookie)
      .send({
        hospital: "Princeton-Plainsboro Teaching Hospital",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hospital).toBe("Princeton-Plainsboro Teaching Hospital");
  });

  it("should delete the created doctor", async () => {
    const res = await request(app)
      .delete(`/api/v1/doctors/${testDoctorId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

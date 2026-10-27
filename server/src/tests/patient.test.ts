import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { env } from "../config/env.js";
import { Doctor } from "../models/doctor.model.js";

describe("Patient API Endpoints", () => {
  let adminCookie: string;
  let testDoctor: { _id: string; patientsCount: number };
  let secondDoctor: { _id: string; patientsCount: number };
  let testPatientId: string;

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@doctortracker.com", password: "Admin@12345" });

    adminCookie = loginRes.headers["set-cookie"][0];

    // Fetch two doctors for testing
    const doctors = await Doctor.find().limit(2);
    testDoctor = { _id: doctors[0]._id.toString(), patientsCount: doctors[0].patientsCount };
    secondDoctor = { _id: doctors[1]._id.toString(), patientsCount: doctors[1].patientsCount };
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should list patients with populated doctor details", async () => {
    const res = await request(app)
      .get("/api/v1/patients?page=1&limit=5")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.total).toBeGreaterThan(0);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].doctor).toBeDefined();
      expect(res.body.data[0].doctor.name).toBeDefined();
    }
  });

  it("should return distinct patient filters", async () => {
    const res = await request(app)
      .get("/api/v1/patients/filters")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.conditions)).toBe(true);
    expect(Array.isArray(res.body.data.statuses)).toBe(true);
  });

  it("should create patient and increment doctor's patientsCount", async () => {
    const doctorBefore = await Doctor.findById(testDoctor._id);
    const countBefore = doctorBefore?.patientsCount || 0;

    const res = await request(app)
      .post("/api/v1/patients")
      .set("Cookie", adminCookie)
      .send({
        name: "John Doe",
        age: 42,
        gender: "male",
        phone: "+1-555-0144",
        email: "john.doe@example.com",
        condition: "Hypertension",
        status: "active",
        doctor: testDoctor._id,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("John Doe");
    testPatientId = res.body.data._id;

    const doctorAfter = await Doctor.findById(testDoctor._id);
    expect(doctorAfter?.patientsCount).toBe(countBefore + 1);
  });

  it("should fetch patient detail by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/patients/${testPatientId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(testPatientId);
    expect(res.body.data.condition).toBe("Hypertension");
  });

  it("should reassign doctor and update counts on both doctors", async () => {
    const doc1Before = await Doctor.findById(testDoctor._id);
    const doc2Before = await Doctor.findById(secondDoctor._id);

    const res = await request(app)
      .patch(`/api/v1/patients/${testPatientId}`)
      .set("Cookie", adminCookie)
      .send({
        doctor: secondDoctor._id,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const doc1After = await Doctor.findById(testDoctor._id);
    const doc2After = await Doctor.findById(secondDoctor._id);

    expect(doc1After?.patientsCount).toBe((doc1Before?.patientsCount || 1) - 1);
    expect(doc2After?.patientsCount).toBe((doc2Before?.patientsCount || 0) + 1);
  });

  it("should list doctor-specific patients", async () => {
    const res = await request(app)
      .get(`/api/v1/doctors/${secondDoctor._id}/patients`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.some((p: { _id: string }) => p._id === testPatientId);
    expect(found).toBe(true);
  });

  it("should delete patient and decrement doctor count", async () => {
    const doctorBefore = await Doctor.findById(secondDoctor._id);

    const res = await request(app)
      .delete(`/api/v1/patients/${testPatientId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const doctorAfter = await Doctor.findById(secondDoctor._id);
    expect(doctorAfter?.patientsCount).toBe((doctorBefore?.patientsCount || 1) - 1);
  });
});

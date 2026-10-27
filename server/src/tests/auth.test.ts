import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should fail login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "wrong@user.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should fail validation if email is missing or invalid", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "not-an-email", password: "" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("should login seeded admin successfully and return httpOnly cookie", async () => {
    const admin = await User.findOne({ email: "admin@doctortracker.com" });
    expect(admin).not.toBeNull();

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@doctortracker.com", password: "Admin@12345" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("admin@doctortracker.com");
    expect(res.body.data.user.role).toBe("admin");

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("accessToken");
    expect(cookies[0]).toContain("HttpOnly");
  });

  it("should reject /auth/me when unauthenticated", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return user details on /auth/me with valid cookie", async () => {
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@doctortracker.com", password: "Admin@12345" });

    const cookie = loginRes.headers["set-cookie"];

    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.user.email).toBe("admin@doctortracker.com");
  });

  it("should clear cookie on logout", async () => {
    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const cookies = res.headers["set-cookie"];
    expect(cookies[0]).toContain("accessToken=;");
  });
});

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient, PatientGender, PatientStatus } from "../models/patient.model.js";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "Gastroenterology",
  "General Medicine",
];

const HOSPITALS = [
  "City General Hospital",
  "Metro Health Care",
  "St. Jude Medical Center",
  "Grace Memorial Hospital",
  "Apex Specialty Clinic",
  "Oakwood Community Hospital",
];

const CONDITIONS = [
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Migraine",
  "Coronary Artery Disease",
  "Osteoarthritis",
  "Eczema",
  "Gastritis",
  "Acute Bronchitis",
  "Bone Fracture",
  "Pneumonia",
  "Arrhythmia",
];

const STATUSES: { status: PatientStatus; weight: number }[] = [
  { status: "active", weight: 60 },
  { status: "recovered", weight: 30 },
  { status: "critical", weight: 10 },
];

function getRandomWeightedStatus(): PatientStatus {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const item of STATUSES) {
    cumulative += item.weight;
    if (rand <= cumulative) return item.status;
  }
  return "active";
}

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");
  console.log(`Connecting to: ${env.MONGODB_URI}`);
  await mongoose.connect(env.MONGODB_URI);

  // Sync Indexes
  console.log("⚡ Synchronizing database indexes...");
  await User.syncIndexes();
  await Doctor.syncIndexes();
  await Patient.syncIndexes();

  // Clear existing collections
  console.log("🧹 Clearing existing data...");
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Patient.deleteMany({});

  // 1. Seed Admin User
  console.log("👤 Seeding admin user...");
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash("Admin@12345", salt);

  await User.create({
    name: "System Admin",
    email: "admin@doctortracker.com",
    passwordHash,
    role: "admin",
  });
  console.log("   ✓ Admin created: admin@doctortracker.com / Admin@12345");

  // 2. Seed ~25 Doctors
  console.log("🩺 Seeding 25 doctors...");
  const doctorsData = [];
  const doctorEmails = new Set<string>();

  for (let i = 0; i < 25; i++) {
    const specialization = SPECIALIZATIONS[i % SPECIALIZATIONS.length];
    const hospital = HOSPITALS[i % HOSPITALS.length];
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `Dr. ${firstName} ${lastName}`;

    let email = faker.internet.email({ firstName, lastName }).toLowerCase();
    while (doctorEmails.has(email)) {
      email = faker.internet.email({ firstName: `${firstName}${i}`, lastName }).toLowerCase();
    }
    doctorEmails.add(email);

    doctorsData.push({
      name,
      nameLower: name.toLowerCase().trim(),
      specialization,
      hospital,
      phone: faker.phone.number({ style: "national" }),
      email,
      patientsCount: 0,
      createdAt: faker.date.between({
        from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    });
  }

  const createdDoctors = await Doctor.insertMany(doctorsData);
  console.log(`   ✓ ${createdDoctors.length} doctors seeded.`);

  // 3. Seed ~400 Patients
  console.log("🏥 Seeding 400 patients...");
  const patientsData = [];
  const doctorCounts = new Map<string, number>();

  for (const doc of createdDoctors) {
    doctorCounts.set(doc._id.toString(), 0);
  }

  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 400; i++) {
    // Weighted doctor assignment so some doctors have more patients (creates interesting charts)
    const doctorIndex = Math.floor(Math.pow(Math.random(), 1.5) * createdDoctors.length);
    const assignedDoctor = createdDoctors[doctorIndex];

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const gender: PatientGender = faker.helpers.arrayElement(["male", "female", "other"]);
    const age = faker.number.int({ min: 1, max: 95 });
    const condition = faker.helpers.arrayElement(CONDITIONS);
    const status = getRandomWeightedStatus();
    const admittedAt = faker.date.between({ from: oneYearAgo, to: now });

    const currentCount = doctorCounts.get(assignedDoctor._id.toString()) || 0;
    doctorCounts.set(assignedDoctor._id.toString(), currentCount + 1);

    patientsData.push({
      name,
      nameLower: name.toLowerCase().trim(),
      age,
      gender,
      phone: faker.phone.number({ style: "national" }),
      email: faker.datatype.boolean(0.7)
        ? faker.internet.email({ firstName, lastName }).toLowerCase()
        : undefined,
      condition,
      status,
      notes: faker.datatype.boolean(0.6) ? faker.lorem.sentence() : undefined,
      doctor: assignedDoctor._id,
      admittedAt,
      createdAt: admittedAt,
      updatedAt: admittedAt,
    });
  }

  await Patient.insertMany(patientsData);
  console.log("   ✓ 400 patients seeded.");

  // 4. Reconcile patientsCount for each doctor
  console.log("🔄 Reconciling doctors' patientsCount...");
  const updatePromises = createdDoctors.map((doc) => {
    const count = doctorCounts.get(doc._id.toString()) || 0;
    return Doctor.findByIdAndUpdate(doc._id, { patientsCount: count });
  });
  await Promise.all(updatePromises);
  console.log("   ✓ Patients count synchronized on doctors.");

  console.log("✅ Database seeding complete!");
}

// Execute directly if run as a script
if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  seedDatabase()
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Seed error:", err);
      await mongoose.disconnect();
      process.exit(1);
    });
}

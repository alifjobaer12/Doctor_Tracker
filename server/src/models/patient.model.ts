import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type PatientGender = "male" | "female" | "other";
export type PatientStatus = "active" | "recovered" | "critical";

export interface IPatient extends Document {
  name: string;
  nameLower: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email?: string;
  condition: string;
  status: PatientStatus;
  notes?: string;
  doctor: Types.ObjectId;
  admittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    nameLower: {
      type: String,
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot exceed 120"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    condition: {
      type: String,
      required: [true, "Medical condition is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "recovered", "critical"],
      default: "active",
    },
    notes: {
      type: String,
      trim: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Assigned doctor is required"],
      index: true,
    },
    admittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Maintain nameLower for prefix search
patientSchema.pre<IPatient>("save", function (next) {
  if (this.isModified("name")) {
    this.nameLower = this.name.toLowerCase().trim();
  }
  next();
});

// Explicit Indexes per docs/04
patientSchema.index({ doctor: 1, admittedAt: -1 });
patientSchema.index({ condition: 1, admittedAt: -1 });
patientSchema.index({ status: 1, admittedAt: -1 });
patientSchema.index({ admittedAt: -1 });
patientSchema.index({ nameLower: 1 });

export const Patient: Model<IPatient> = mongoose.model<IPatient>("Patient", patientSchema);

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  nameLower: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    nameLower: {
      type: String,
      trim: true,
      lowercase: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    hospital: {
      type: String,
      required: [true, "Hospital is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    patientsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Maintain nameLower for index-friendly prefix search
doctorSchema.pre<IDoctor>("save", function (next) {
  if (this.isModified("name")) {
    this.nameLower = this.name.toLowerCase().trim();
  }
  next();
});

// Explicit Indexes defined per docs/04
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ nameLower: 1 });
doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });
doctorSchema.index({ createdAt: -1 });

export const Doctor: Model<IDoctor> = mongoose.model<IDoctor>("Doctor", doctorSchema);

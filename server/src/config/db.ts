import mongoose from "mongoose";
import { env } from "./env.js";

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Reuse in-flight connection promise if connecting
  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => {
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error("MongoDB Connection Error:", err.message);
        throw err;
      });
  }

  return cachedPromise;
};

export const disconnectDB = async (): Promise<void> => {
  try {
    cachedPromise = null;
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};

import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  createdAt: Date;
  updatedAt: Date;
}

export function sanitizeUser(user: IUser): UserResponse {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class AuthService {
  static async login(email: string, password: string):Promise<{ user: UserResponse; token: string }> {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        role: user.role,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  static async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return sanitizeUser(user);
  }
}

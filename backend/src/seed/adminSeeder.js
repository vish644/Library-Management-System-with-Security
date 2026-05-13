import dotenv from "dotenv";

import bcrypt from "bcryptjs";

import mongoose from "mongoose";

import connectDB from "../config/db.js";

import User from "../models/User.js";

dotenv.config();

connectDB();

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      username: "admin",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");

      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedAdmin();

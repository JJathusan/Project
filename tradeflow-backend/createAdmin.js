import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@tradeflow.com";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "admin",
      companyName: "TradeFlow"
    });

    await admin.save();

    console.log("✅ Admin created successfully");
    console.log("📧 Email: admin@tradeflow.com");
    console.log("🔑 Password: admin123");

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@zocure.com" });
    if (existingAdmin) {
      console.log("❌ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@zocure.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully");
    console.log("Email: admin@zocure.com");
    console.log("Password: admin123");

    // Create a test doctor
    const existingDoctor = await User.findOne({ email: "doctor@zocure.com" });
    if (!existingDoctor) {
      const doctorPassword = await bcrypt.hash("doctor123", 10);
      const doctorUser = new User({
        name: "Dr. John Smith",
        email: "doctor@zocure.com",
        password: doctorPassword,
        role: "doctor",
      });

      await doctorUser.save();
      console.log("✅ Test doctor created successfully");
      console.log("Email: doctor@zocure.com");
      console.log("Password: doctor123");
    }

    // Create a test user
    const existingUser = await User.findOne({ email: "user@zocure.com" });
    if (!existingUser) {
      const userPassword = await bcrypt.hash("user123", 10);
      const regularUser = new User({
        name: "Test User",
        email: "user@zocure.com",
        password: userPassword,
        role: "user",
      });

      await regularUser.save();
      console.log("✅ Test user created successfully");
      console.log("Email: user@zocure.com");
      console.log("Password: user123");
    }

    console.log("\n🎉 All test users created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();

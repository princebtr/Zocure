// controllers/adminController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.addDoctor = async (req, res) => {
  const { name, email, password, specialization } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      specialization, // you can store this in a separate field or extend the model
    });

    await doctor.save();
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

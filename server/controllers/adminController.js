const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const upload = require("../utils/multer");
const mongoose = require("mongoose");

// Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { name, email, password, specialization, experience, fees } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user account
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });
    await user.save();

    // Use Cloudinary URL if file uploaded
    let imageUrl = null;
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    // Create doctor profile
    const doctorData = {
      userId: user._id,
      specialization,
      experience: parseInt(experience),
      fees: parseFloat(fees),
      image: imageUrl,
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      message: "Doctor added successfully",
      doctor: {
        _id: doctor._id,
        name: user.name,
        email: user.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        fees: doctor.fees,
        image: doctor.image,
      },
    });
  } catch (error) {
    console.error("Error adding doctor:", error, error?.stack);
    res
      .status(500)
      .json({ message: "Error adding doctor", error: error.message || error });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");
    console.log("Raw doctors from DB:", doctors);
    // Flatten userId fields for frontend compatibility
    const formatted = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.userId?.name || "",
      email: doc.userId?.email || "",
      specialization: doc.specialization,
      experience: doc.experience,
      fees: doc.fees,
      image: doc.image,
    }));
    console.log("Formatted doctors:", formatted);
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete doctor with ID:", id);
    console.log("Request params:", req.params);
    console.log("Request URL:", req.url);

    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id);
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    const doctor = await Doctor.findById(id);
    console.log("Found doctor:", doctor);

    if (!doctor) {
      console.log("Doctor not found for ID:", id);
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Delete the user account as well
    await User.findByIdAndDelete(doctor.userId);
    console.log("Deleted user account for doctor");

    // Delete the doctor profile
    await Doctor.findByIdAndDelete(id);
    console.log("Deleted doctor profile");

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res
      .status(500)
      .json({ message: "Error deleting doctor", error: error.message });
  }
};

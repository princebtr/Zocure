const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const upload = require("../utils/multer");

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
    res.status(200).json(formatted);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Delete the user account as well
    await User.findByIdAndDelete(doctor.userId);

    // Delete the doctor profile
    await Doctor.findByIdAndDelete(doctorId);

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting doctor", error: error.message });
  }
};

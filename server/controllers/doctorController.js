const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Admin: Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    const { userId, specialization, experience, fees, availableSlots } = req.body;

    // Verify user exists and is a doctor
    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(400).json({ message: "Invalid user or role" });
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor profile already exists" });
    }

    const doctor = new Doctor({
      userId,
      specialization,
      experience,
      fees,
      availableSlots
    });

    await doctor.save();
    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Error adding doctor", error: error.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("userId", "name email");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor", error: error.message });
  }
};

// Doctor: Update available slots
exports.updateSlots = async (req, res) => {
  try {
    const doctorId = req.user.id; // From auth middleware
    const { availableSlots } = req.body;

    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.availableSlots = availableSlots;
    await doctor.save();

    res.status(200).json({ message: "Slots updated successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Error updating slots", error: error.message });
  }
};

// Doctor: Get my appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id; // From auth middleware
    const doctor = await Doctor.findOne({ userId: doctorId });
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("userId", "name email")
      .sort({ appointmentDate: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};